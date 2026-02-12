import { itemWithAsset } from "#types/ingame/itemWithAsset";
import { ingameScoreboardBottomPlayerData } from "#types/ingame/scoreboardBottom/ingameScoreboardBottomPlayerData";

export function getSortedInventory(
  playerData: ingameScoreboardBottomPlayerData,
): (itemWithAsset | undefined)[] {
  if (!playerData.items) return Array(6).fill({ id: 0 });

  const items =
    playerData.items?.filter((item) => item.slot < 6) ??
    ([] as (itemWithAsset | undefined)[]);

  //sort items by cost, with undefined items at the end
  const regularItems = items.sort(
    (a, b) => (a?.cost ?? 0) - (b?.cost ?? 0),
  ) as (itemWithAsset | undefined)[];

  //fill items with empty items if less than 6, undefined items at start
  while (regularItems.length < 6) {
    regularItems.unshift(undefined);
  }
  return regularItems ?? [];
}

export function getTrinket(
  playerData: ingameScoreboardBottomPlayerData,
): itemWithAsset | undefined {
  return playerData.items?.find((item) => item.slot === 6);
}

export function getRoleQuest(
  playerData: ingameScoreboardBottomPlayerData,
): itemWithAsset | undefined {
  return playerData.items?.find((item) => item.slot === 8);
}
