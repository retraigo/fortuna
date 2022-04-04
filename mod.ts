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

export class GachaMachine {
  items: Array<GachaData>;
  tiers: GachaTier[];
  pool: Array<number>;
  rawItems: Array<GachaData>;
  /**
   * A gacha system
   * @param {Array} items - Array of items featured in the gacha
   * @param {Array} pool - Array of tiers featured in the gacha
   */
  constructor(items: Array<RawGachaData>, pool: Array<number> = [1]) {
    this.items = [];
    this.tiers = [];
    this.pool = pool;
    this.rawItems = items;
    this.configItems(items);
    this.configTiers(items);
  }
  configItems(items: Array<RawGachaData>) {
    items = items.sort((a, b) => a.tier - b.tier);
    if (items.some((x) => x.featured)) {
      items = items.map((x) => ({
        chance: x.featured ? (x.chance + 1) : x.chance,
        featured: x.featured,
        result: x.result,
        tier: x.tier,
      }));
    }
    this.items = items;
    return items;
  }
  configTiers(items: Array<RawGachaData>) {
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
  get(num = 1, detailed = false) {
    let result = [];
    for (let i = num; i > 0; --i) {
      result.push(this._get(detailed));
    }
    return result;
  }
  _get(detailed = false) {
    let tier = this._roll(
      this.tiers.map((x) => ({ chance: x.chance, result: x.tier })),
    );
    const result = this._roll(this.items.filter((x) => x.tier == tier.result));
    return detailed ? result : result.result;
  }
  _roll(choices: Array<GachaChoice>): GachaChoice {
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
  static createItem(
    result: any,
    chance = 1,
    tier = 1,
    featured = false,
  ): RawGachaData {
    return { result, chance, tier, featured };
  }
}

export {GachaMachine as Fortuna}
export {GachaMachine as default}