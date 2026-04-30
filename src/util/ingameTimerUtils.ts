import type { ingameAbilityInfo } from "#types/ingame/ingameAbilityInfo";
import type { itemWithAsset } from "#types/ingame/itemWithAsset";
import type { tabPlayer } from "#types/ingame/tab/tabPlayer";
import type { ingameScoreboardBottomPlayerData } from "#types/ingame/scoreboardBottom/ingameScoreboardBottomPlayerData";

/**
 * All timer values in ingame data use **absolute game time** semantics:
 *   - `readyAt / respawnAt === 0`  → currently ready / alive
 *   - `value > gameTime`           → currently on cooldown / dead; `value - gameTime` seconds remain
 *   - `value > 0 && value <= gameTime` → was on cooldown historically, now recovered
 *
 * Pass `ingameFrontendData.gameTime` (or the value from the reactive store) as
 * `gameTime` to all helpers below.
 */

// ---------------------------------------------------------------------------
// Generic primitive
// ---------------------------------------------------------------------------

/**
 * Return the seconds remaining until `readyAt`.
 * Returns `0` when the timer has expired or was never set.
 */
export function getRemaining(
  readyAt: number | undefined,
  gameTime: number,
): number {
  if (!readyAt || readyAt <= 0) return 0;
  return Math.max(0, readyAt - gameTime);
}

/**
 * Return `true` while `readyAt` is in the future relative to `gameTime`.
 */
export function isActive(
  readyAt: number | undefined,
  gameTime: number,
): boolean {
  return getRemaining(readyAt, gameTime) > 0;
}

// ---------------------------------------------------------------------------
// Ability cooldowns
// ---------------------------------------------------------------------------

/**
 * Seconds remaining on an ability's cooldown.
 * Returns `0` when the ability is ready.
 */
export function getAbilityCooldownRemaining(
  ability: ingameAbilityInfo | null | undefined,
  gameTime: number,
): number {
  return getRemaining(ability?.readyAt, gameTime);
}

/**
 * Whether an ability is currently on cooldown.
 */
export function isAbilityOnCooldown(
  ability: ingameAbilityInfo | null | undefined,
  gameTime: number,
): boolean {
  return getAbilityCooldownRemaining(ability, gameTime) > 0;
}

/**
 * Fraction of the cooldown that has elapsed (0 = just put on cooldown, 1 = ready).
 * Useful for progress-ring / conic-fill animations.
 * Returns `1` when ready or when `totalCooldown` is zero.
 */
export function getAbilityCooldownFraction(
  ability: ingameAbilityInfo | null | undefined,
  gameTime: number,
): number {
  if (!ability || !ability.totalCooldown || ability.totalCooldown <= 0)
    return 1;
  const remaining = getAbilityCooldownRemaining(ability, gameTime);
  if (remaining <= 0) return 1;
  return 1 - remaining / ability.totalCooldown;
}

// ---------------------------------------------------------------------------
// Item cooldowns
// ---------------------------------------------------------------------------

/**
 * Seconds remaining on an item's active cooldown.
 * Returns `0` when the item is ready.
 */
export function getItemCooldownRemaining(
  item: itemWithAsset | null | undefined,
  gameTime: number,
): number {
  return getRemaining(item?.readyAt, gameTime);
}

/**
 * Whether an item active is currently on cooldown.
 */
export function isItemOnCooldown(
  item: itemWithAsset | null | undefined,
  gameTime: number,
): boolean {
  return getItemCooldownRemaining(item, gameTime) > 0;
}

/**
 * Fraction of the item cooldown that has elapsed (0 → just activated, 1 → ready).
 * Returns `1` when ready or when `maxCooldown` is zero / unknown.
 */
export function getItemCooldownFraction(
  item: itemWithAsset | null | undefined,
  gameTime: number,
): number {
  if (!item?.maxCooldown || item.maxCooldown <= 0) return 1;
  const remaining = getItemCooldownRemaining(item, gameTime);
  if (remaining <= 0) return 1;
  return 1 - remaining / item.maxCooldown;
}

// ---------------------------------------------------------------------------
// Player respawn
// ---------------------------------------------------------------------------

/**
 * Seconds remaining until a tab-player respawns.
 * Returns `0` when the player is alive.
 */
export function getRespawnRemaining(
  player: tabPlayer | ingameScoreboardBottomPlayerData | null | undefined,
  gameTime: number,
): number {
  return getRemaining(player?.respawnAt, gameTime);
}

/**
 * Whether a player is currently dead.
 */
export function isPlayerDead(
  player: tabPlayer | ingameScoreboardBottomPlayerData | null | undefined,
  gameTime: number,
): boolean {
  return getRespawnRemaining(player, gameTime) > 0;
}

// ---------------------------------------------------------------------------
// Bound factory
// ---------------------------------------------------------------------------

export interface BoundIngameTimerUtils {
  /** Seconds remaining until `readyAt`. Returns `0` when expired or unset. */
  getRemaining(readyAt: number | undefined): number;
  /** `true` while `readyAt` is in the future. */
  isActive(readyAt: number | undefined): boolean;
  getAbilityCooldownRemaining(
    ability: ingameAbilityInfo | null | undefined,
  ): number;
  isAbilityOnCooldown(ability: ingameAbilityInfo | null | undefined): boolean;
  getAbilityCooldownFraction(
    ability: ingameAbilityInfo | null | undefined,
  ): number;
  getItemCooldownRemaining(item: itemWithAsset | null | undefined): number;
  isItemOnCooldown(item: itemWithAsset | null | undefined): boolean;
  getItemCooldownFraction(item: itemWithAsset | null | undefined): number;
  getRespawnRemaining(
    player: tabPlayer | ingameScoreboardBottomPlayerData | null | undefined,
  ): number;
  isPlayerDead(
    player: tabPlayer | ingameScoreboardBottomPlayerData | null | undefined,
  ): boolean;
}

/**
 * Create a set of timer utilities pre-bound to a `gameTime` source.
 *
 * @param getGameTime - Called each time a utility is invoked to read the
 *   current game time. Pass `() => client.getIngameData().gameTime` or a
 *   reactive getter from your framework.
 *
 * @example
 * ```ts
 * const timers = createIngameTimerUtils(() => client.getIngameData().gameTime);
 * timers.isPlayerDead(player);
 * timers.getAbilityCooldownRemaining(ability);
 * ```
 */
export function createIngameTimerUtils(
  getGameTime: () => number,
): BoundIngameTimerUtils {
  return {
    getRemaining: (readyAt) => getRemaining(readyAt, getGameTime()),
    isActive: (readyAt) => isActive(readyAt, getGameTime()),
    getAbilityCooldownRemaining: (ability) =>
      getAbilityCooldownRemaining(ability, getGameTime()),
    isAbilityOnCooldown: (ability) =>
      isAbilityOnCooldown(ability, getGameTime()),
    getAbilityCooldownFraction: (ability) =>
      getAbilityCooldownFraction(ability, getGameTime()),
    getItemCooldownRemaining: (item) =>
      getItemCooldownRemaining(item, getGameTime()),
    isItemOnCooldown: (item) => isItemOnCooldown(item, getGameTime()),
    getItemCooldownFraction: (item) =>
      getItemCooldownFraction(item, getGameTime()),
    getRespawnRemaining: (player) => getRespawnRemaining(player, getGameTime()),
    isPlayerDead: (player) => isPlayerDead(player, getGameTime()),
  };
}
