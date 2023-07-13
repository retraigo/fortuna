// Copyright 2022-2023 NeTT. All rights reserved. MIT license.

/**
 * Data fed to the constructor.
 * The `result` property holds the result that will be returned after rolling.
 * `chance` is the weight of the result.
 */
export interface GachaChoice<T> {
  result: T;
  chance: number;
}
/**
 * Gacha system.
 */
export class GachaMachine<T> {
  #items: T[];
  #weights: number[];
  #alias: number[];
  #totalChance: number;
  constructor(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#alias = new Array(items.length);
    this.#weights = new Array(items.length);
    this.#totalChance = 0;
    this.#configItems(items);
  }
  set items(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#configItems(items);
  }
  /** Setup items for rolling. */
  #configItems(items: GachaChoice<T>[]) {
    this.#alias.fill(-1);
    this.#weights.fill(-1);
    let i = 0;
    while (i < items.length) {
      this.#totalChance += items[i].chance;
      i += 1;
    }
    i = 0;
    const multiplier = items.length / this.#totalChance;
    const long = [], small = [];
    while (i < items.length) {
      const prob = items[i].chance * multiplier;
      if (prob > 1) long.push(i);
      else small.push(i);
      this.#items[i] = items[i].result;
      this.#weights[i] = prob;
      i += 1;
    }
    while (long.length && small.length) {
      const j = small.pop();
      const k = long.at(-1);
      if (j === undefined || k === undefined) {
        throw new Error(
          "This definitely shouldn't happen. Open an issue at https://github.com/retraigo/fortuna",
        ); // this will hopefully never happen
      }
      this.#alias[j] = k;
      this.#weights[k] -= 1 - this.#weights[j];
    }
  }
  /**
   * Roll items from the gacha machine.
   * ```ts
   * const machine = new GachaMachine(items);
   * machine.get(11)
   * ```
   *
   * If you are looking for the `distinct` rolls,
   * try importing GachaMachine3 instead of GachaMachine.
   */
  get(count: number): T[] {
    let i = 0;
    const res = new Array(count);
    while (i < count) {
      res[i] = this.#items[this.#roll()];
      i += 1;
    }
    return res;
  }
  #roll(): number {
    const inter = Math.random() * this.#items.length
    const i = ~~inter
    const y = inter - i
    return y < this.#weights[i] ? i : this.#alias[i];
  }
}
