import type { GachaChoice } from "../../mod.ts";

/**
 * Roll one from an array of gacha choices.
 * @param {GachaChoice[]} choices - Choices to roll from.
 * @returns {GachaChoice} Items rolled.
 */
export function roll<ItemType>(
  choices: GachaChoice<ItemType>[],
): GachaChoice<ItemType> {
  const total = choices.reduce(
    (acc: number, val: GachaChoice<ItemType>) => acc + val.chance,
    0,
  );
  const result = Math.random() * total;
  let going = 0.0;
  for (let i = 0; i < choices.length; ++i) {
    going += choices[i].chance;
    if (result < going) {
      return choices[i];
    }
  }
  return choices[Math.floor(Math.random() * choices.length)];
}
