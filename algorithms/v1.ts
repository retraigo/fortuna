import type { GachaChoice } from "../mod.ts";

/**
 * Roll one from an array of gacha choices.
 * @param {GachaChoice[]} choices - Choices to roll from.
 * @returns {GachaChoice} Items rolled.
 */
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
): GachaChoice<ItemType> {
  const filteredChoices = [];
  for (let i = 0; i < choices.length; ++i) {
    for (let chance = choices[i].chance; chance > 0.0; --chance) {
      filteredChoices.push(i);
    }
  }
  return choices[
    filteredChoices[Math.floor(Math.random() * filteredChoices.length)]
  ];
}
