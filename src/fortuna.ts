// Copyright 2022 NeTT. All rights reserved. MIT license.

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
 * Gacha system.
 */
export class GachaMachine<T> {
  #items: ComputedGachaData<T>[];
  #totalChance: number;
  constructor(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#totalChance = 0;
    this.#configItems(items);
  }
  set items(items: GachaChoice<T>[]) {
    this.#items = new Array(items.length);
    this.#totalChance = 0;
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
    this.#totalChance = cumulativeChance;
  }
  /**
   * Roll items from the gacha machine.
   * ```ts
   * const machine = new GachaMachine(items);
   * machine.get(11)
   * ```
   */
  get(count: number, distinct = false) {
    if (distinct && count > this.#items.length) {
      throw new RangeError(`count must be less than number of items in pool.`);
    }
    const totalChance = this.#totalChance;
    const result = new Array<T>(count);
    let i = 0;
    if (distinct) {
      const data = this.#items.slice(0);
      while (i < count) {
        const res = rollWithBinarySearch(data, totalChance);
        result[i] = data[res].result;
        data.splice(res, 1);
        i += 1;
      }
    } else {
      const data = this.#items;
      while (i < count) {
        result[i] = data[rollWithBinarySearch(data, totalChance)].result;
        i += 1;
      }
    }
    return result;
  }
}

function rollWithBinarySearch<T>(
  items: ComputedGachaData<T>[],
  totalChance?: number,
): number {
  // failing to provide totalChance does not affect performance.
  if (!totalChance) totalChance = items[items.length - 1].cumulativeChance;
  if (items.length === 1) return 0;
  const rng = Math.random() * totalChance;
  let lower = 0;
  let max = items.length - 1;
  let mid = Math.trunc((max + lower) / 2);
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
      mid = Math.trunc((max + lower) / 2);
    } else {
      max = mid - 1;
      mid = Math.trunc((max + lower) / 2);
    }
  }
  return mid;
}
