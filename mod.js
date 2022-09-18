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
        while(i1 < items1.length){
            cumulativeChance += items1[i1].chance;
            this.items.push({
                result: items1[i1].result,
                chance: items1[i1].chance,
                cumulativeChance: cumulativeChance,
                tier: items1[i1].tier || 1
            });
            i1 += 1;
        }
        this.totalChance = cumulativeChance;
    }
    get(count = 1) {
        if (count === 1) {
            return [
                GachaMachine.rollWithBinarySearch(this.items, this.totalChance), 
            ];
        }
        const result = new Array(count);
        let i = 0;
        while(i < count){
            result[i] = GachaMachine.rollWithBinarySearch(this.items, this.totalChance);
            i += 1;
        }
        return result;
    }
    getFromTier(tiers, count = 1) {
        const toRoll = [];
        let i = 0;
        let cumulativeChance = 0;
        while(i < this.items.length){
            if (tiers.includes(this.items[i].tier)) {
                cumulativeChance += this.items[i].chance;
                toRoll.push({
                    ...this.items[i],
                    cumulativeChance
                });
            }
            i += 1;
        }
        if (toRoll.length === 0) return [];
        const result = [];
        i = 0;
        while(i < count){
            result.push(GachaMachine.rollWithBinarySearch(toRoll, cumulativeChance));
            i += 1;
        }
        return result;
    }
    static rollWithBinarySearch(items, totalChance) {
        if (!totalChance) totalChance = items[items.length - 1].cumulativeChance;
        if (items.length === 1) return items[0].result;
        const rng = Math.random() * totalChance;
        let lower = 0;
        let max = items.length - 1;
        let mid = Math.floor((max + lower) / 2);
        while(mid != 0 && lower <= max){
            if (items[mid].cumulativeChance > rng && items[mid - 1].cumulativeChance < rng || items[mid].cumulativeChance == rng) return items[mid].result;
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
    static rollWithLinearSearch(choices, totalChance = 0) {
        let total = totalChance;
        let i = 0;
        if (totalChance === 0) {
            while(i < choices.length){
                total += choices[i].chance;
                i += 1;
            }
        }
        const result = Math.random() * total;
        let going = 0.0;
        i = 0;
        while(i < choices.length){
            going += choices[i].chance;
            if (result < going) {
                return choices[i].result;
            }
            i += 1;
        }
        return choices[Math.floor(Math.random() * choices.length)].result;
    }
}
export { GachaMachine as GachaMachine };
