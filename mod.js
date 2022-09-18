// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class GachaMachine {
    items;
    tiers;
    maxTier;
    totalChance;
    pool;
    constructor(items){
        this.items = [];
        this.tiers = [];
        this.pool = [];
        this.maxTier = 1;
        this.totalChance = 0;
        this.#configTiers(items);
        this.#configItems(items);
    }
    #configTiers(items) {
        let i = 0;
        const tiers = new Set();
        while(i < items.length){
            tiers.add(items[i].tier || 1);
            i += 1;
        }
        for (const tier of tiers){
            if (tier > this.maxTier) this.maxTier = tier;
        }
        const itemsInTier = new Uint8Array(this.maxTier + 1);
        const totalChanceInTier = new Uint8Array(this.maxTier + 1);
        i = 0;
        while(i < items.length){
            Atomics.add(itemsInTier, items[i].tier || 1, 1);
            Atomics.add(totalChanceInTier, items[i].tier || 1, items[i].chance);
            i += 1;
        }
        for (const tier1 of tiers){
            this.tiers.push({
                tier: tier1,
                totalChance: totalChanceInTier[tier1],
                items: itemsInTier[tier1]
            });
        }
        this.pool = Array.from(tiers);
    }
    #configItems(items1) {
        let i1 = 0;
        let cumulativeChance = 0;
        const cumulativeChanceInTier = new Uint8Array(this.maxTier + 1);
        while(i1 < items1.length){
            this.items.push({
                result: items1[i1].result,
                cumulativeChance: cumulativeChance,
                cumulativeChanceInTier: Atomics.add(cumulativeChanceInTier, items1[i1].tier || 1, items1[i1].chance),
                tier: items1[i1].tier || 1
            });
            cumulativeChance += items1[i1].chance;
            i1 += 1;
        }
        this.totalChance = cumulativeChance;
    }
    get(count = 1) {
        const result = [];
        let i = 0;
        while(i < count){
            result.push(this.#roll());
            i += 1;
        }
        return result;
    }
    #roll() {
        if (this.items.length === 1) return this.items[0].result;
        const rng = Math.random() * this.totalChance;
        let lower = 0;
        let max = this.items.length - 1;
        let mid = Math.floor((max + lower) / 2);
        while(!(this.items[mid].cumulativeChance > rng && this.items[mid - 1].cumulativeChance < rng) && this.items[mid].cumulativeChance !== rng && mid != 0 && lower <= max){
            if (this.items[mid].cumulativeChance < rng) {
                lower = mid + 1;
                mid = Math.floor((max + lower) / 2);
            } else {
                max = mid - 1;
                mid = Math.floor((max + lower) / 2);
            }
        }
        return this.items[mid].result;
    }
}
export { GachaMachine as GachaMachine };
