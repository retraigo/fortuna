/**
 * Data fed to the constructor.
 * The `result` property holds the result that will be returned after rolling.
 * `chance` is the weight of the result.
 * `tier` is an optional parameter to group the items for rolling.
 */
export interface GachaData<ItemType> {
  result: ItemType;
  chance: number;
  tier?: number;
}

/**
 * Raw data fed to the linear search function.
 * The `result` property holds the result that will be returned after rolling.
 * `chance` is the weight of the result.
 */
export interface GachaChoice<ItemType> {
  result: ItemType;
  chance: number;
}

/**
 * Data transformed by the constructor, fed to the binary search function.
 * The `result` property holds the result that will be returned after rolling.
 * `chance` is the weight of the result.
 * `cumulativeChance` is used to make it fit for binary search.
 * `tier` is an optional parameter to group the items for rolling.
 */
export interface ComputedGachaData<ItemType> {
  result: ItemType;
  chance: number;
  cumulativeChance: number;
  tier: number;
}

/**
 * Something unnecessary.
 */
export interface ComputedTierData {
  totalChance: number;
  items: number;
  tier: number;
}

/**
 * A gacha machine for weighted selection.
 */
export class GachaMachine<ItemType> {
  items: ComputedGachaData<ItemType>[];
  tiers: ComputedTierData[];
  maxTier: number;
  totalChance: number;
  pool: number[];
  /**
   * Create a new gacha machine for weighted selection.
   * @param items Array of items to roll from.
   */
  constructor(items: GachaData<ItemType>[]) {
    this.items = [];
    this.tiers = [];
    this.pool = [];
    this.maxTier = 1;
    this.totalChance = 0;
    this.#configTiers(items);
    this.#configItems(items);
  }
  #configTiers(items: GachaData<ItemType>[]) {
    let i = 0;
    const tiers = new Set<number>();
    while (i < items.length) {
      tiers.add(items[i].tier || 1);
      i += 1;
    }
    for (const tier of tiers) {
      if (tier > this.maxTier) this.maxTier = tier;
    }
    const itemsInTier = new Uint8Array(this.maxTier + 1);
    const totalChanceInTier = new Uint8Array(this.maxTier + 1);
    i = 0;
    while (i < items.length) {
      Atomics.add(itemsInTier, items[i].tier || 1, 1);
      Atomics.add(totalChanceInTier, items[i].tier || 1, items[i].chance);
      i += 1;
    }
    for (const tier of tiers) {
      this.tiers.push({
        tier: tier,
        totalChance: totalChanceInTier[tier],
        items: itemsInTier[tier],
      });
    }
    this.pool = Array.from(tiers);
  }
  #configItems(items: GachaData<ItemType>[]) {
    let i = 0;
    let cumulativeChance = 0;
    while (i < items.length) {
      cumulativeChance += items[i].chance;
      this.items.push({
        result: items[i].result,
        chance: items[i].chance,
        cumulativeChance: cumulativeChance,
        tier: items[i].tier || 1,
      });
      i += 1;
    }
    this.totalChance = cumulativeChance;
  }
  /**
   * Roll items from the gacha machine.
   * @param count Number of items to roll.
   * @returns `count` number of items from the items fed to the constructor.
   * @example
   * ```ts
   * const machine = new GachaMachine(items);
   * machine.get(11)
   * ```
   */
  get(count = 1): ItemType[] {
    if (count === 1) {
      return [
        GachaMachine.rollWithBinarySearch(this.items, this.totalChance),
      ];
    }
    const result = [];
    let i = 0;
    while (i < count) {
      result.push(
        GachaMachine.rollWithBinarySearch(this.items, this.totalChance),
      );
      i += 1;
    }
    return result;
  }
  /**
   * Roll items from specific tiers.
   * @param tiers List of tiers to roll from.
   * @param count Number of items to roll.
   * @returns `count` number of items from the items fed to the constructor.
   */
  getFromTier(tiers: number[], count = 1): ItemType[] {
    const toRoll: ComputedGachaData<ItemType>[] = [];
    let i = 0;
    let cumulativeChance = 0;
    while (i < this.items.length) {
      if (tiers.includes(this.items[i].tier)) {
        cumulativeChance += this.items[i].chance;
        toRoll.push({ ...this.items[i], cumulativeChance });
      }
      i += 1;
    }
    if (toRoll.length === 0) return [];
    const result = [];
    i = 0;
    while (i < count) {
      result.push(GachaMachine.rollWithBinarySearch(toRoll, cumulativeChance));
      i += 1;
    }
    return result;
  }
  /**
   * Roll one item from a pool using binary search. Requires special transformation.
   * @param items List of items to roll from, each having a `result` and `cumulativeChance`.
   * @param totalChance Total weight of the pool.
   * @returns An item from the pool.
   * @example
   * ```ts
   * const items = [
   *   { result: "SSR cool character", cumulativeChance: 1 },
   *   { result: "Kinda rare character", cumulativeChance: 4 },
   *   { result: "Mob character", cumulativeChance: 9 },
   *   { result: "Mob character", cumulativeChance: 14 },
   *   { result: "Mob character", cumulativeChance: 19 },
   * ]
   * GachaMachine.rollWithBinarySearch(items) // Rolls one item from the list of items
   * ```
   * Supplying totalChance does not affect the execution speed much.
   */
  static rollWithBinarySearch<ItemType>(
    items: ComputedGachaData<ItemType>[],
    totalChance?: number,
  ): ItemType {
    if (!totalChance) totalChance = items[items.length - 1].cumulativeChance;
    if (items.length === 1) return items[0].result;
    const rng = Math.random() * totalChance;
    let lower = 0;
    let max = items.length - 1;
    let mid = Math.floor((max + lower) / 2);
    while (
      mid != 0 && lower <= max
    ) {
      if (
        (items[mid].cumulativeChance > rng &&
          items[mid - 1].cumulativeChance < rng) ||
        items[mid].cumulativeChance == rng
      ) return items[mid].result;
      if (items[mid].cumulativeChance < rng) {
        lower = mid + 1;
        mid = Math.floor((max + lower) / 2);
      } else {
        max = mid - 1;
        mid = Math.floor((max + lower) / 2);
      }
    }
    return items[mid].result;
  }
  /**
   * Roll one item from a pool using linear search. Simple and great for smaller pools.
   * @param items List of items to roll from, each having a `result` and `chance`.
   * @param totalChance Total weight of the pool.
   * @returns An item from the pool.
   * @example
   * ```ts
   * const items = [
   *   { result: "SSR cool character", chance: 1 },
   *   { result: "Kinda rare character", chance: 3 },
   *   { result: "Mob character", chance: 5 },
   *   { result: "Mob character", chance: 5 },
   *   { result: "Mob character", chance: 5 },
   * ]
   * GachaMachine.rollWithLinearSearch(items) // Rolls one item from the list of items
   * ```
   * @example
   * ```ts
   * const items = [
   *   { result: "SSR cool character", chance: 1 },
   *   { result: "Kinda rare character", chance: 3 },
   *   { result: "Mob character", chance: 5 },
   *   { result: "Mob character", chance: 5 },
   *   { result: "Mob character", chance: 5 },
   * ]
   * GachaMachine.rollWithLinearSearch(items, 19) // Rolls one item from the list of items, faster because the total chance is known.
   * ```
   */
  static rollWithLinearSearch<ItemType>(
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
}
