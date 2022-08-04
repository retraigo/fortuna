/**
 * Gacha items provided to the Gacha Machine.
 */
export interface GachaData<ItemType> {
  tier: number;
  result: ItemType;
  chance: number;
}

/**
 * Gacha items returned after rolling.
 */
export interface GachaChoice<ItemType> {
  result: ItemType;
  chance: number;
}

/**
 * Gacha tier with tier number, chance and item count.
 */
export interface GachaTier {
  items: number;
  chance: number;
  tier: number;
}

/**
 * Gacha machine setup to roll items from.
 */
export class GachaMachine<ItemType> {
  items: GachaData<ItemType>[];
  tiers: GachaTier[];
  constructor(items: GachaData<ItemType>[]) {
    this.items = [];
    this.tiers = [];
    this.configItems(items);
    this.configTiers(items);
  }
  get pool(): number[] {
    return Array.from(
      this.items.reduce(
        (acc: Set<number>, val: GachaData<ItemType>) => acc.add(val.tier),
        new Set<number>(),
      ).entries(),
    ).map((x) => x[0]);
  }
  /**
   * Configure gacha items (meant for internal use)
   * @param {GachaData[]} items - Array of gacha items
   */
  configItems(items: GachaData<ItemType>[]): void {
    const newItems: GachaData<ItemType>[] = items = items.sort((a, b) =>
      a.tier - b.tier
    )
      .map((x) => ({
        chance: x.chance,
        result: x.result,
        tier: x.tier,
      }));
    this.items = newItems;
  }
  /**
   * Configure gacha tiers (meant for internal use).
   * @param {GachaData[]} items - Array of gacha items.
   */
  configTiers(items: GachaData<ItemType>[]): void {
    const tiers: GachaTier[] = [];
    const pool = this.pool;
    for (let i = 0; i < pool.length; ++i) {
      tiers[pool[i]] = { items: 0, chance: 0, tier: pool[i] };
    }
    for (let i = items.length; i > 0; --i) {
      if (!pool.includes(items[i - 1].tier)) continue;
      tiers[items[i - 1].tier].items += 1;
      tiers[items[i - 1].tier].chance += items[i - 1].chance;
    }
    //    I don't know why I did this...
    //    const tierList = [];
    //    for (const i in tiers) {
    //      tierList.push(tiers[i]);
    //    }
    //    this.tiers = tierList;
    this.tiers = tiers;
  }
  /**
   * Roll a number of items from the machine.
   * @param {number} num - Number of items to roll.
   * @param {boolean} detailed - Whether to return the entire roll object instead of just the result.
   * @param {number[]} pool - Custom pool of tiers to use for this roll.
   * @returns {ItemType[]} array of results.
   */
  get(
    num = 1,
    detailed = false,
    pool: number[] = this.pool,
  ): GachaChoice<ItemType>[] | ItemType[] {
    if (detailed) {
      const result: GachaChoice<ItemType>[] = [];
      for (let i = num; i > 0; --i) {
        result.push(this.choose(pool, detailed));
      }
      return result;
    } else {
      const result: ItemType[] = [];
      for (let i = num; i > 0; --i) {
        result.push(this.choose(pool));
      }
      return result;
    }
  }
  /**
   * Get one item from the machine.
   * @param {number[]} pool - Pool of tiers to roll from.
   * @param {boolean} detailed - Whether to provide the "choice" parameter in the result.
   */
  choose(pool: number[], detailed: boolean): GachaChoice<ItemType>;
  choose(pool: number[]): ItemType;
  choose(
    pool: number[] = this.pool,
    detailed?: boolean,
  ): GachaChoice<ItemType> | ItemType {
    const tier = GachaMachine.roll<number>(
      this.tiers.filter((x) => pool.includes(x.tier)).map((x) => ({
        chance: x.chance,
        result: x.tier,
      })),
    );
    const result = GachaMachine.roll<ItemType>(
      this.items.filter((x) => x.tier == tier.result),
      //this.items.filter((x) => pool.includes(x.tier)), => Tried this but this slows everything down.
    );
    return detailed ? result : result.result;
  }
  /**
   * Roll one from an array of gacha choices.
   * @param {GachaChoice[]} choices - Choices to roll from.
   * @param {number} totalChance - Sum of all chance properties.
   * @returns {GachaChoice} Items rolled.
   */
  static roll<ItemType>(
    choices: GachaChoice<ItemType>[],
    totalChance?: number,
  ): GachaChoice<ItemType> {
    let total = totalChance || 0;
    let i = 0;
    while (i < choices.length) {
      total += choices[i].chance;
      i += 1;
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
  /**
   * Create a gacha item to add to the machine.
   * @param {any} result - Data of the item.
   * @param {number} chance - Weight of the item. More weight = more common.
   * @param {number} tier - Tier of the item (optional and defaults to 1).
   * @param {boolean} featured - Whether the item should be featured in its pool.
   * @returns {RawGachaData} item - Item to be passed to the constructor
   */
  static createItem<ItemType>(
    result: ItemType,
    chance = 1,
    tier = 1,
  ): GachaData<ItemType> {
    return { result, chance, tier };
  }
  /**
   * Create a gacha choice to directly roll using the static roll method.
   * @param {any} result - Any item to be rolled
   * @param {number} chance - Weight of the item
   * @returns {GachaChoice}
   */
  static createRollChoice<ItemType>(
    result: ItemType,
    chance = 1,
  ): GachaChoice<ItemType> {
    return { result, chance };
  }
}

// Remove `Fortuna` export in v2. Or rename `GachaMachine` to `Fortuna`.
export { GachaMachine as Fortuna };
export { GachaMachine as default };
