import type { GachaChoice } from "../mod.ts";

// Dropped before release since it was slightly faster than v4.

/**
 * Roll one from an array of gacha choices.
 * @param {GachaChoice[]} choices - Choices to roll from.
 * @returns {GachaChoice} Items rolled.
 */
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
): GachaChoice<ItemType> {
  let total = 0;
  let i = 0;
  while (i < choices.length) {
    total += choices[i].chance;
    i += 1;
  }
  const result = Math.random() * total;
  i -= 1;
  while (i > -1) {
    total -= choices[i].chance;
    if (result > total) {
      return choices[i];
    }
    i -= 1;
  }
  return choices[Math.floor(Math.random() * choices.length)];
}
