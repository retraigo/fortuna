export interface GachaData<ItemType> {
  result: ItemType;
  chance: number;
  tier?: number;
}

export interface GachaChoice<ItemType> {
  result: ItemType;
  chance: number;
}

export interface ComputedGachaData<ItemType> {
  result: ItemType;
  cumulativeChance: number;
  cumulativeChanceInTier: number;
  tier: number;
}

export interface ComputedTierData {
  totalChance: number;
  items: number;
  tier: number;
}

export class GachaMachine<ItemType> {
  items: ComputedGachaData<ItemType>[];
  tiers: ComputedTierData[];
  maxTier: number;
  totalChance: number;
  pool: number[];
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
    const cumulativeChanceInTier = new Uint8Array(this.maxTier + 1);
    while (i < items.length) {
      this.items.push({
        result: items[i].result,
        cumulativeChance: cumulativeChance,
        cumulativeChanceInTier: Atomics.add(
          cumulativeChanceInTier,
          items[i].tier || 1,
          items[i].chance,
        ),
        tier: items[i].tier || 1,
      });
      cumulativeChance += items[i].chance;
      i += 1;
    }
    this.totalChance = cumulativeChance;
  }
  get(count = 1): ItemType[] {
    const result = [];
    let i = 0;
    while (i < count) {
      result.push(this.#roll());
      i += 1;
    }
    return result;
  }
  #roll(): ItemType {
    if (this.items.length === 1) return this.items[0].result;
    const rng = Math.random() * this.totalChance;
    let lower = 0;
    let max = this.items.length - 1;
    let mid = Math.floor((max + lower) / 2);
    while (
      !(this.items[mid].cumulativeChance > rng &&
        this.items[mid - 1].cumulativeChance < rng) &&
      this.items[mid].cumulativeChance !== rng && mid != 0 && lower <= max
    ) {
      //        console.log(this.items[mid].cumulativeChance, this.items[mid-1].cumulativeChance, rng)
      //        console.log(rng, mid)
      if (this.items[mid].cumulativeChance < rng) {
        //        console.log("le", max, lower, mid)
        //        if(mid === 150) throw new Error("!%)")
        lower = mid + 1;
        mid = Math.floor((max + lower) / 2);
      } else {
        //        console.log("mo", max, lower, mid)

        max = mid - 1;
        mid = Math.floor((max + lower) / 2);
      }
    }
    return this.items[mid].result;
  }
}
