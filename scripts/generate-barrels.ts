/**
 * Barrel file generator for the types/ directory.
 *
 * Recursively walks types/ and creates an index.ts in every sub-directory
 * that re-exports all sibling .ts files and child directories.
 * A second pass detects cross-category naming conflicts and automatically
 * renames the lower-priority duplicate using a category prefix.
 *
 * Run with:  npm run generate-barrels
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, relative, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TYPES_DIR = join(__dirname, "../types");

// Top-level category dirs in priority order (first = highest priority).
// Must match the export order in src/index.ts.
const CATEGORY_PRIORITY = [
  "cloud",
  "hotkey",
  "ingame",
  "message",
  "postgame",
  "pregame",
  "rest",
  "shared",
  "twitch",
];

const HEADER = `\
/**
 * This is an auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */
`;

// ---------------------------------------------------------------------------
// Phase 1: generate barrel index.ts files (bottom-up)
// ---------------------------------------------------------------------------

function generateBarrel(dir: string): void {
  const entries = readdirSync(dir, { withFileTypes: true });

  const files: string[] = [];
  const subdirs: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      generateBarrel(join(dir, entry.name));
      subdirs.push(entry.name);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "index.ts"
    ) {
      files.push(entry.name.slice(0, -3));
    }
  }

  const lines: string[] = [HEADER];

  for (const file of files.sort((a, b) => a.localeCompare(b))) {
    lines.push(`export * from './${file}';`);
  }
  for (const subdir of subdirs.sort((a, b) => a.localeCompare(b))) {
    lines.push(`export * from './${subdir}';`);
  }

  const content = lines.join("\n") + "\n";
  const indexPath = join(dir, "index.ts");
  writeFileSync(indexPath, content, "utf-8");

  const rel = relative(TYPES_DIR, indexPath).replaceAll("\\", "/");
  console.log(`  types/${rel}`);
}

// ---------------------------------------------------------------------------
// Phase 2: detect cross-category naming conflicts and patch barrel files
// ---------------------------------------------------------------------------

/** Regex that matches the first exported name in an auto-generated source file. */
const EXPORT_NAME_RE =
  /^export\s+(?:abstract\s+)?(?:default\s+)?(?:class|enum|interface|type|const|function)\s+(\w+)/gm;

/** Collect { exportedName -> absoluteFilePath } for all non-barrel .ts files under dir. */
function collectExports(dir: string, out: Map<string, string>): void {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      collectExports(full, out);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "index.ts"
    ) {
      const src = readFileSync(full, "utf-8");
      EXPORT_NAME_RE.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = EXPORT_NAME_RE.exec(src)) !== null) {
        if (!out.has(m[1])) out.set(m[1], full); // first occurrence wins
      }
    }
  }
}

function resolveConflicts(): void {
  // name -> { category, filePath } of the priority winner
  const winners = new Map<string, { category: string; filePath: string }>();

  for (const category of CATEGORY_PRIORITY) {
    const catDir = join(TYPES_DIR, category);
    if (!existsSync(catDir)) continue;

    const exports = new Map<string, string>();
    collectExports(catDir, exports);

    for (const [name, filePath] of exports) {
      if (winners.has(name)) {
        // Lower-priority duplicate – rename in its direct containing barrel.
        const dirOfFile = dirname(filePath);
        const fileBase = basename(filePath, ".ts");
        const indexPath = join(dirOfFile, "index.ts");

        if (!existsSync(indexPath)) continue;

        const winnerCategory = winners.get(name)!.category;
        const prefix = category.charAt(0).toUpperCase() + category.slice(1);
        const nameTitleCase = name.charAt(0).toUpperCase() + name.slice(1);
        const newName = `${prefix}${nameTitleCase}`;

        let content = readFileSync(indexPath, "utf-8");
        const old = `export * from './${fileBase}';`;
        const replacement = `export { ${name} as ${newName} } from './${fileBase}'; // renamed: conflicts with ${winnerCategory}/${name}`;

        if (content.includes(old)) {
          content = content.replace(old, replacement);
          writeFileSync(indexPath, content, "utf-8");
          console.log(
            `  Conflict resolved: ${name} in '${category}' -> ${newName}` +
              ` (wins: '${winnerCategory}')`,
          );
        }
      } else {
        winners.set(name, { category, filePath });
      }
    }
  }
}

console.log("Generating barrel files...");
generateBarrel(TYPES_DIR);

console.log("Resolving cross-category naming conflicts...");
resolveConflicts();

console.log("Done.");
