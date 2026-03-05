import { itemWithAsset } from "#types/ingame/itemWithAsset";

export function getRoleQuestProgressPercent(item: itemWithAsset | undefined) {
  if (!item || !item.stats || item.stats.length < 3) {
    return 0;
  }

  //current at 1 index, max at 2 index
  const current = item.stats[1] ?? 0;
  const max = item.stats[2] ?? 1;
  return Math.min(100, Math.max(0, (current / max) * 100));
}
export function isRoleQuestComplete(item: itemWithAsset | undefined) {
  if (!item) {
    return false;
  }

  return getRoleQuestProgressPercent(item) >= 100;
}

export function isRoleQuestTeleport(item: itemWithAsset | undefined) {
  if (!item) {
    return false;
  }

  return item.id === 1220;
}
