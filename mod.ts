export interface RawGachaData {
  tier: number;
  featured?: boolean;
  result: any;
  chance: number;
}

export interface GachaData {
  tier: number;
  result: any;
  chance: number;
}

export interface GachaChoice {
  result: any;
  chance: number;
}

export interface GachaTier {
  items: number;
  chance: number;
  tier: number;
}

/**
 * Gacha system for Deno
 * @class GachaMachine
 */

export class GachaMachine {
  items: GachaData[];
  tiers: GachaTier[];
  pool: number[];
  rawItems: GachaData[];
  /**
   * A gacha system
   * @param {GachaData[]} items - Array of items featured in the gacha
   * @param {number[]} pool - Array of tiers featured in the gacha
   */
  constructor(items: Array<RawGachaData>, pool: Array<number> = []) {
    this.items = [];
    this.tiers = [];
    this.pool = pool;
    if(!this.pool || this.pool.length === 0) {
      this.pool = items.filter((x, i) => items.indexOf(items.find(y => y.tier === x.tier) || x) !== i).map(x => x.tier) || [1]
    }
    this.pool.forEach(x => {
      if(!items.map(y => y.tier).includes(x)) throw new Error(`None of the items in the machine match one or more tiers from the provided pool (${x}).`)
    })
    console.log(this.pool)
    this.rawItems = items;
    this.configItems(items);
    this.configTiers(items);
  }
  /**
   * Configure gacha items (meant for internal use)
   * @param {RawGachaData[]} items - Array of gacha items
   * @returns {GachaData[]} newItems
   */
  configItems(items: RawGachaData[]): GachaData[] {
    let newItems: GachaData[] = items = items.sort((a, b) => a.tier - b.tier)
      .map((x) => ({
        chance: x.featured ? (x.chance + 1) : x.chance,
        result: x.result,
        tier: x.tier,
      }));
    this.items = newItems;
    return newItems;
  }
  /**
   * Configure gacha tiers (meant for internal use).
   * @param {RawGachaData[]} items - Array of gacha items.
   * @returns {GachaTier[]} tierList - Array of gacha tiers.
   */
  configTiers(items: Array<RawGachaData>): GachaTier[] {
    let tiers: GachaTier[] = [];
    for (let i = 0; i < this.pool.length; ++i) {
      tiers[this.pool[i]] = { items: 0, chance: 0, tier: this.pool[i] };
    }
    for (let i = items.length; i > 0; --i) {
      if (!this.pool.includes(items[i - 1].tier)) continue;
      tiers[items[i - 1].tier].items += 1;
      tiers[items[i - 1].tier].chance += items[i - 1].chance;
    }
    let tierList = [];
    for (let i in tiers) {
      tierList.push(tiers[i]);
    }
    this.tiers = tierList;
    return tierList;
  }
  /**
   * @param {number} num - Number of items to roll.
   * @param {boolean} detailed - Whether to return the entire roll object instead of just the result.
   * @param {number[]} pool - Custom pool to use for this roll.
   * @returns {any[]} array of results.
   */
  get(num = 1, detailed = false, pool: number[] = []): GachaChoice[] | any[] {
    if(pool.length > 0) {
      const newMachine = new GachaMachine(this.rawItems, pool)
      return newMachine.get(num, detailed)
    }
    let result = [];
    for (let i = num; i > 0; --i) {
      result.push(this._get(detailed));
    }
    return result;
  }
  _get(detailed = false) {
    let tier = GachaMachine._roll(
      this.tiers.map((x) => ({ chance: x.chance, result: x.tier })),
    );
    const result = GachaMachine._roll(
      this.items.filter((x) => x.tier == tier.result),
    );
    return detailed ? result : result.result;
  }
  /**
   * Roll one from an array of gacha choices.
   * @param {GachaChoice[]} choices - Choices to roll from.
   * @returns {GachaChoice} rolled.
   */
  static _roll(choices: GachaChoice[]): GachaChoice {
    let filteredChoices = [];
    let total = 0.0;
    for (let i = 0; i < choices.length; ++i) {
      if (choices[i].chance > 0.0) {
        filteredChoices.push(choices[i]);
        total += choices[i].chance;
      }
    }
    let result = Math.random() * total;
    let going = 0.0;
    for (let i = 0; i < filteredChoices.length; ++i) {
      going += filteredChoices[i].chance;
      if (result < going) {
        return filteredChoices[i];
      }
    }
    return filteredChoices[Math.floor(Math.random() * filteredChoices.length)];
  }
  /**
   * Create a gacha item
   * @param {any} result - Data of the item.
   * @param {number} chance - Weight of the item. More weight = more common.
   * @param {number} tier - Tier of the item (optional and defaults to 1).
   * @param {boolean} featured - Whether the item should be featured in its pool.
   * @returns {RawGachaData} item - Item to be passed to the constructor
   */
  static createItem(
    result: any,
    chance = 1,
    tier = 1,
    featured = false,
  ): RawGachaData {
    return { result, chance, tier, featured };
  }
  /**
   * Create a gacha choice
   * @param {any} result - Any item to be rolled
   * @param {number} chance - Weight of the item
   * @returns {GachaChoice}
   */
  static createRollChoice(result: any, chance = 1): GachaChoice {
    return { result, chance };
  }
}

export { GachaMachine as Fortuna };
export { GachaMachine as default };
