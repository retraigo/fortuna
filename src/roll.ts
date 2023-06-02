export interface GachaChoice<ItemType> {
  result: ItemType;
  chance: number;
}

/**
 * Roll one item from a pool using linear search. Simple and great for one-time use pools.
 * Use `GachaMachine` if you will be picking multiple items from the same pool.
 * @param items List of items to roll from, each having a `result` and `chance`.
 * @param totalChance Total weight of the pool.
 * ```ts
 * const items = [
 *   { result: "SSR cool character", chance: 1 },
 *   { result: "Kinda rare character", chance: 3 },
 *   { result: "Mob character", chance: 5 },
 *   { result: "Mob character", chance: 5 },
 *   { result: "Mob character", chance: 5 },
 * ]
 * roll(items) // Rolls one item from the list of items
 * ```
 *
 * ```ts
 * const items = [
 *   { result: "SSR cool character", chance: 1 },
 *   { result: "Kinda rare character", chance: 3 },
 *   { result: "Mob character", chance: 5 },
 *   { result: "Mob character", chance: 5 },
 *   { result: "Mob character", chance: 5 },
 * ]
 * roll(items, 19) // Rolls one item from the list of items, faster because the total chance is known.
 * ```
 */
export function roll<ItemType>(
  choices: ItemType[],
  chances: number[],
  totalChance?: number,
): ItemType;
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
  totalChance?: number,
): ItemType;
export function roll<ItemType>(
  choices: ItemType[] | GachaChoice<ItemType>[],
  chanceArrOrTotalChance: number | number[] = 0,
  totalChance = 0,
): ItemType {
  const asArray = Array.isArray(chanceArrOrTotalChance);
  let total = asArray ? totalChance : chanceArrOrTotalChance || 0;
  if (typeof total !== "number") {
    throw new TypeError(
      `Invalid type for total chance. Expected 'undefined' or 'number', got '${typeof total}'`,
    );
  }
  let i = 0;
  if (total === 0) {
    while (i < choices.length) {
      total += asArray
        ? chanceArrOrTotalChance[i]
        : (choices[i] as GachaChoice<ItemType>).chance;
      i += 1;
    }
  }
  const result = Math.random() * total;
  let going = 0.0;
  i = 0;
  while (i < choices.length) {
    going += asArray
      ? chanceArrOrTotalChance[i]
      : (choices[i] as GachaChoice<ItemType>).chance;
    if (result < going) {
      return asArray
        ? choices[i] as ItemType
        : (choices[i] as GachaChoice<ItemType>).result;
    }
    i += 1;
  }
  return asArray
    ? choices[Math.floor(Math.random() * choices.length)] as ItemType
    : (choices[Math.floor(Math.random() * choices.length)] as GachaChoice<
      ItemType
    >).result;
}
