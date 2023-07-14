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
 * Data transformed by the constructor, fed to the binary search function.
 * The `result` property holds the result that will be returned after rolling.
 * `cumulativeChance` is used to make it fit for binary search.
 */
export interface ComputedGachaData<T> {
  result: T;
  cumulativeChance: number;
}

/**
 * Gacha system for rolling n distinct items
 * from the weighted collection.
 */
export class LimitedGachaMachine<T> {
  #items: ComputedGachaData<T>[];
  constructor(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#configItems(items);
  }
  set items(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#configItems(items);
  }
  /** Setup items for rolling. */
  #configItems(items: GachaChoice<T>[]) {
    let i = 0;
    let cumulativeChance = 0;
    while (i < items.length) {
      cumulativeChance += items[i].chance;
      this.#items[i] = {
        result: items[i].result,
        cumulativeChance: cumulativeChance,
      };
      i += 1;
    }
  }
  /**
   * Roll distinct items from the gacha machine.
   * ```ts
   * const machine = new GachaMachine(items);
   * machine.get(11)
   * ```
   *
   * However, rolling distinct items does not mutate the pool.
   * The items rolled are only distinct within the `n` items.
   */
  get(count: number) {
    if (count > this.#items.length) {
      throw new RangeError(`count must be less than number of items in pool.`);
    }
    const result = new Array<T>(count);
    let i = 0;
    const data = this.#items.slice(0);
    while (i < count) {
      const res = rollWithBinarySearch(data);
      result[i] = data[res].result;
      data.splice(res, 1);
      i += 1;
    }
    return result;
  }
}

function rollWithBinarySearch<T>(
  items: ComputedGachaData<T>[],
): number {
  const totalChance = items[items.length - 1].cumulativeChance;
  if (items.length === 1) return 0;
  const rng = Math.random() * totalChance;
  let lower = 0;
  let max = items.length - 1;
  let mid = (max + lower) >> 1;
  while (
    mid != 0 && lower <= max
  ) {
    if (
      (items[mid].cumulativeChance > rng &&
        items[mid - 1].cumulativeChance < rng) ||
      items[mid].cumulativeChance == rng
    ) return mid;
    if (items[mid].cumulativeChance < rng) {
      lower = mid + 1;
      mid = (max + lower) >> 1;
    } else {
      max = mid - 1;
      mid = (max + lower) >> 1;
    }
  }
  return mid;
}
