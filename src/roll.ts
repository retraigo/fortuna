export interface GachaChoice<ItemType> {
  result: ItemType;
  chance: number;
}

/**
 * Roll one item from a pool using linear search. Simple and great for smaller pools.
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
  choices: GachaChoice<ItemType>[],
  totalChance = 0,
): ItemType {
  let total = totalChance;
  let i = 0;
  if (totalChance === 0) {
    while (i < choices.length) {
      total += choices[i].chance;
      i += 1;
    }
  }
  const result = Math.random() * total;
  let going = 0.0;
  i = 0;
  while (i < choices.length) {
    going += choices[i].chance;
    if (result < going) {
      return choices[i].result;
    }
    i += 1;
  }
  return choices[Math.floor(Math.random() * choices.length)].result;
}
