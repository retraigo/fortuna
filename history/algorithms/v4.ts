import type { GachaChoice } from "../../mod.ts";

/**
 * Roll one from an array of gacha choices.
 * @param {GachaChoice[]} choices - Choices to roll from.
 * @returns {GachaChoice} Items rolled.
 */
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
  totalChance = 0,
): GachaChoice<ItemType> {
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
      return choices[i];
    }
    i += 1;
  }
  return choices[Math.floor(Math.random() * choices.length)];
}
