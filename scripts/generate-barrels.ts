/**
 * Barrel file generator for the types/ directory.
 *
 * Phase 0 normalizes casing so the generated output is deterministic on
 * Windows (case-insensitive filesystem): every type file is renamed to match
 * its primary exported symbol, and every relative / #types import specifier
 * is rewritten to the exact on-disk casing. Without this, the same module can
 * be reached through differently-cased paths, which rollup-plugin-dts treats
 * as distinct modules and duplicates every type in dist/index.d.ts.
 *
 * Phase 1 recursively walks types/ and creates an index.ts in every
 * sub-directory that re-exports all sibling .ts files and child directories.
 * Phase 2 detects cross-category naming conflicts and automatically renames
 * the lower-priority duplicate using a category prefix.
 *
 * Run with:  npm run generate-barrels
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, renameSync } from "fs";
import { join, relative, basename, dirname, resolve } from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const TYPES_DIR = join(ROOT, "types");

// Directories whose import specifiers are normalized to on-disk casing.
const SOURCE_DIRS = ["types", "src", "test", "examples"];

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

/** Regex that matches the first exported name in an auto-generated source file. */
const EXPORT_NAME_RE =
  /^export\s+(?:abstract\s+)?(?:default\s+)?(?:class|enum|interface|type|const|function)\s+(\w+)/gm;

// ---------------------------------------------------------------------------
// Phase 0a: rename type files so the basename matches the primary export
// ---------------------------------------------------------------------------

/**
 * Rename a file, preferring `git mv` so that case-only renames are recorded
 * in the git index (core.ignorecase hides them from plain fs renames).
 */
function renameTracked(from: string, to: string): void {
  try {
    execFileSync("git", ["mv", "-f", relative(ROOT, from), relative(ROOT, to)], {
      cwd: ROOT,
      stdio: "pipe",
    });
  } catch {
    renameSync(from, to);
  }
}

function canonicalizeFileNames(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      canonicalizeFileNames(full);
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".ts") &&
      entry.name !== "index.ts"
    ) {
      const src = readFileSync(full, "utf-8");
      EXPORT_NAME_RE.lastIndex = 0;
      const m = EXPORT_NAME_RE.exec(src);
      if (!m) continue;
      const canonical = `${m[1]}.ts`;
      if (entry.name !== canonical && entry.name.toLowerCase() === canonical.toLowerCase()) {
        renameTracked(full, join(dir, canonical));
        console.log(`  renamed: ${relative(ROOT, dir)}\\${entry.name} -> ${canonical}`);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Phase 0b: rewrite import specifiers to exact on-disk casing
// ---------------------------------------------------------------------------

/** Cached case-insensitive directory listings: dir -> (lowercase name -> exact name). */
const dirCache = new Map<string, Map<string, string>>();

function listDir(dir: string): Map<string, string> {
  let cached = dirCache.get(dir);
  if (!cached) {
    cached = new Map();
    for (const entry of readdirSync(dir)) cached.set(entry.toLowerCase(), entry);
    dirCache.set(dir, cached);
  }
  return cached;
}

/**
 * Rewrite a single specifier to on-disk casing, or return null when it does
 * not resolve to a local file (package imports, unresolved paths).
 */
function canonicalizeSpecifier(spec: string, fromDir: string): string | null {
  let cur: string;
  let segments: string[];
  let prefix: string;

  if (spec === "#types" || spec.startsWith("#types/")) {
    cur = TYPES_DIR;
    prefix = "#types";
    segments = spec === "#types" ? [] : spec.slice("#types/".length).split("/");
  } else if (spec.startsWith(".")) {
    cur = fromDir;
    prefix = "";
    segments = spec.split("/");
  } else {
    return null;
  }

  const out: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (seg === "." || seg === "..") {
      cur = resolve(cur, seg);
      out.push(seg);
      continue;
    }
    const entries = listDir(cur);
    const isLast = i === segments.length - 1;
    // A segment can be a directory, or (last segment only) a file with an
    // implied .ts extension or an explicit .js extension compiled from .ts.
    const asDir = entries.get(seg.toLowerCase());
    if (isLast) {
      const tsName = entries.get(`${seg.toLowerCase()}.ts`);
      if (tsName) {
        out.push(tsName.slice(0, -3));
        break;
      }
      if (seg.toLowerCase().endsWith(".js")) {
        const jsAsTs = entries.get(`${seg.toLowerCase().slice(0, -3)}.ts`);
        if (jsAsTs) {
          out.push(`${jsAsTs.slice(0, -3)}.js`);
          break;
        }
      }
    }
    if (asDir === undefined) return null;
    out.push(asDir);
    cur = join(cur, asDir);
  }

  return prefix ? [prefix, ...out].join("/") : out.join("/");
}

const SPECIFIER_RE = /((?:import|export)\s[^'"]*?from\s+)(['"])([^'"]+)\2/g;

function normalizeSpecifiers(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      normalizeSpecifiers(full);
    } else if (entry.isFile() && entry.name.endsWith(".ts")) {
      const src = readFileSync(full, "utf-8");
      let changed = false;
      const updated = src.replace(SPECIFIER_RE, (match, lead, quote, spec) => {
        const canonical = canonicalizeSpecifier(spec, dir);
        if (canonical === null || canonical === spec) return match;
        changed = true;
        return `${lead}${quote}${canonical}${quote}`;
      });
      if (changed) {
        writeFileSync(full, updated, "utf-8");
        console.log(`  fixed imports: ${relative(ROOT, full)}`);
      }
    }
  }
}

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

console.log("Normalizing type file name casing...");
canonicalizeFileNames(TYPES_DIR);

console.log("Normalizing import specifier casing...");
for (const dir of SOURCE_DIRS) {
  const full = join(ROOT, dir);
  if (existsSync(full)) normalizeSpecifiers(full);
}

console.log("Generating barrel files...");
generateBarrel(TYPES_DIR);

console.log("Resolving cross-category naming conflicts...");
resolveConflicts();

console.log("Done.");
