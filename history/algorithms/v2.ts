import type { GachaChoice } from "../../mod.ts";

/**
 * Roll one from an array of gacha choices.
 * @param {GachaChoice[]} choices - Choices to roll from.
 * @returns {GachaChoice} Items rolled.
 */
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
): GachaChoice<ItemType> {
  const filteredChoices = [];
  let total = 0.0;
    for (let i = 0; i < choices.length; ++i) {
      if (choices[i].chance > 0.0) {
        filteredChoices.push(choices[i]);
        total += choices[i].chance;
      }
  }
  const result = Math.random() * total;
  let going = 0.0;
  for (let i = 0; i < filteredChoices.length; ++i) {
    going += filteredChoices[i].chance;
    if (result < going) {
      return filteredChoices[i];
    }
  }
  return filteredChoices[Math.floor(Math.random() * filteredChoices.length)];
}
