import { DamageType } from "#types/ingame/damageRecap/damageType";
import { SpellClassification } from "#types/shared/spellClassification";
import type { damageRecapEntry } from "#types/ingame/damageRecap/damageRecapEntry";
import type { damageRecapSpellEntry } from "#types/ingame/damageRecap/damageRecapSpellEntry";
import type { iSpellObjectResource } from "#types/ingame/damageRecap/iSpellObjectResource";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PHYS_COLOR = "#E84057";
export const MAGIC_COLOR = "#5383E8";
export const TRUE_COLOR = "#F0E6D3";

// ---------------------------------------------------------------------------
// Primitive helpers
// ---------------------------------------------------------------------------

/** Returns a CSS hex color string for the given damage type. */
export function dmgTypeColor(type: DamageType | string | number): string {
  const normalized = typeof type === "string" ? type.toLowerCase() : type;
  if (normalized === DamageType.Physical || normalized === "physical")
    return PHYS_COLOR;
  if (normalized === DamageType.Magic || normalized === "magic")
    return MAGIC_COLOR;
  if (normalized === DamageType.True || normalized === "true")
    return TRUE_COLOR;
  return "#888";
}

/**
 * Formats a damage number for display.
 * Values ≥ 1 000 are rendered as e.g. `"1.5k"`.
 */
export function formatDamage(value: number): string {
  return value >= 1000
    ? `${(value / 1000).toFixed(1)}k`
    : `${Math.round(value)}`;
}

/**
 * Safe lookup for a damage-by-type map.
 * Tries the original key first, then its lowercase form, then returns 0.
 */
export function getDamageByType(
  map: { [k: string]: number },
  key: string,
): number {
  return map[key] ?? map[key.toLowerCase()] ?? 0;
}

// ---------------------------------------------------------------------------
// Bar segments
// ---------------------------------------------------------------------------

export interface DamageBarSegment {
  /** CSS hex color. */
  color: string;
  /** Width as a percentage (0–100). */
  pct: number;
}

/**
 * Computes percentage-width bar segments (physical → magic → true damage)
 * for a damage-by-type map.  Segments narrower than 0.5 % are filtered out.
 */
export function damageBarSegments(
  damageByType: { [k: string]: number },
  total: number,
): DamageBarSegment[] {
  const t = total || 1;
  return [
    {
      color: PHYS_COLOR,
      pct: (getDamageByType(damageByType, "Physical") / t) * 100,
    },
    {
      color: MAGIC_COLOR,
      pct: (getDamageByType(damageByType, "Magic") / t) * 100,
    },
    {
      color: TRUE_COLOR,
      pct: (getDamageByType(damageByType, "True") / t) * 100,
    },
  ].filter((s) => s.pct > 0.5);
}

// ---------------------------------------------------------------------------
// Spell aggregation
// ---------------------------------------------------------------------------

export interface AggregatedSpellEntry {
  spellData?: iSpellObjectResource;
  damage: number;
  damageType: DamageType;
}

/**
 * Aggregates a list of spell entries by (visual identity × damage type) and
 * returns them sorted by total damage descending.
 *
 * Grouping key:
 * - `BasicAttack` / `CritAttack` classifications each collapse to a single
 *   stable key so all auto-attacks are counted together.
 * - All other spells group by `iconAsset` when present, falling back to
 *   `spellName` — both qualified by damage type.
 */
export function aggregateSpellEntries(
  spells: damageRecapSpellEntry[],
): AggregatedSpellEntry[] {
  const agg = new Map<string, AggregatedSpellEntry>();
  for (const s of spells) {
    if (!s.spellData) continue;
    const classification = s.spellData.classification;
    let groupKey: string;
    if (classification === SpellClassification.BasicAttack) {
      groupKey = "__autoattack__";
    } else if (classification === SpellClassification.CritAttack) {
      groupKey = "__critattack__";
    } else {
      // Use || (not ??) so an empty string falls through to spellName,
      // preventing all icon-less spells from collapsing into one bucket.
      groupKey = s.spellData.iconAsset || s.spellData.spellName;
    }
    const key = `${groupKey}::${s.damageType}`;
    const existing = agg.get(key);
    if (existing) {
      existing.damage += s.damage;
    } else {
      agg.set(key, {
        spellData: s.spellData,
        damage: s.damage,
        damageType: s.damageType,
      });
    }
  }
  return [...agg.values()].sort((a, b) => b.damage - a.damage);
}

// ---------------------------------------------------------------------------
// Entry normalization & grouping
// ---------------------------------------------------------------------------

export type EntityType = "champion" | "minion" | "turret" | "baron" | "monster";

export interface NormalizedDamageEntry {
  /** Stable group key used for de-duplication. */
  key: string;
  /** Human-readable display name. */
  displayName: string;
  /** Champion portrait backend path (champions only). */
  squareImg?: string;
  entityType: EntityType;
  totalDamage: number;
  damageByType: { [k: string]: number };
  /** Aggregated and sorted spell breakdown. */
  spells: AggregatedSpellEntry[];
}

/**
 * Classifies a well-known non-champion name into a stable group descriptor,
 * or returns `null` when the name does not match any known pattern.
 */
function classifySpecialEntity(name: string): {
  key: string;
  displayName: string;
  entityType: Extract<EntityType, "minion" | "turret" | "baron">;
} | null {
  if (/baron/i.test(name)) {
    return {
      key: "__baron__",
      displayName: "Baron Nashor",
      entityType: "baron",
    };
  }
  if (/^minion_t/i.test(name)) {
    const isOrder = /^minion_t1/i.test(name);
    return {
      key: isOrder ? "__minion_order__" : "__minion_chaos__",
      displayName: "Minions",
      entityType: "minion",
    };
  }
  if (/^turret_t/i.test(name)) {
    const isOrder = /^turret_torder/i.test(name);
    return {
      key: isOrder ? "__turret_order__" : "__turret_chaos__",
      displayName: "Turrets",
      entityType: "turret",
    };
  }
  return null;
}

/**
 * Maps `damageRecapEntry` objects to `NormalizedDamageEntry`, grouping by:
 *
 * - **Known special entities** (baron, minions, turrets) into shared buckets.
 * - **Champions** — entries whose `sourceName` contains no `.` character —
 *   keyed by the exact source name.
 * - **Everything else** (jungle monsters, game mode specific entities, …) — grouped by the
 *   base name segment before the first `.`, with trailing camp IDs and the
 *   `SRU_` prefix stripped for readability.
 *
 * Results are sorted by total damage descending; only the top `limit` entries
 * are returned.
 */
export function normalizeDamageEntries(
  entries: damageRecapEntry[],
  limit = 5,
): NormalizedDamageEntry[] {
  const grouped = new Map<string, NormalizedDamageEntry>();
  const pendingSpells = new Map<string, damageRecapSpellEntry[]>();

  for (const entry of entries) {
    const special = classifySpecialEntity(entry.sourceName);
    if (special) {
      const existing = grouped.get(special.key);
      if (existing) {
        existing.totalDamage += entry.totalDamage;
        for (const [k, v] of Object.entries(entry.damageByType)) {
          existing.damageByType[k] = (existing.damageByType[k] ?? 0) + v;
        }
      } else {
        grouped.set(special.key, {
          key: special.key,
          displayName: special.displayName,
          entityType: special.entityType,
          totalDamage: entry.totalDamage,
          damageByType: { ...entry.damageByType },
          spells: [],
        });
      }
    } else if (!entry.sourceName.includes(".")) {
      // Champion — names never contain a '.' (e.g. "Ahri", "MissFortune")
      grouped.set(entry.sourceName, {
        key: entry.sourceName,
        displayName: entry.source?.name ?? entry.sourceName,
        squareImg: entry.source?.squareImg,
        entityType: "champion",
        totalDamage: entry.totalDamage,
        damageByType: { ...entry.damageByType },
        spells: aggregateSpellEntries(entry.spells),
      });
    } else {
      // Monster / NPC — group by base name (strip instance suffix and SRU_ prefix)
      const baseName = entry.sourceName
        .split(".")[0]
        .replace(/_\d+$/, "")
        .replace(/^SRU_/i, "");
      const existing = grouped.get(baseName);
      if (existing) {
        existing.totalDamage += entry.totalDamage;
        for (const [k, v] of Object.entries(entry.damageByType)) {
          existing.damageByType[k] = (existing.damageByType[k] ?? 0) + v;
        }
      } else {
        grouped.set(baseName, {
          key: baseName,
          displayName: baseName,
          squareImg: entry.source?.squareImg,
          entityType: "monster",
          totalDamage: entry.totalDamage,
          damageByType: { ...entry.damageByType },
          spells: [],
        });
      }
      const pending = pendingSpells.get(baseName) ?? [];
      pending.push(...entry.spells);
      pendingSpells.set(baseName, pending);
    }
  }

  // Resolve accumulated spells for each monster group
  for (const [key, spells] of pendingSpells) {
    const entry = grouped.get(key);
    if (entry) entry.spells = aggregateSpellEntries(spells);
  }

  return [...grouped.values()]
    .sort((a, b) => b.totalDamage - a.totalDamage)
    .slice(0, limit);
}
