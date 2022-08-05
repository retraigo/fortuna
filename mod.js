// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class GachaMachine {
    items;
    tiers;
    constructor(items){
        this.items = [];
        this.tiers = [];
        this.configItems(items);
        this.configTiers(items);
    }
    get pool() {
        return Array.from(this.items.reduce((acc, val)=>acc.add(val.tier), new Set()).entries()).map((x)=>x[0]);
    }
    configItems(items) {
        const newItems = items = items.sort((a, b)=>a.tier - b.tier).map((x)=>({
                chance: x.chance,
                result: x.result,
                tier: x.tier
            }));
        this.items = newItems;
    }
    configTiers(items) {
        const tiers = [];
        const pool = this.pool;
        for(let i = 0; i < pool.length; ++i){
            tiers[pool[i]] = {
                items: 0,
                chance: 0,
                tier: pool[i]
            };
        }
        for(let i1 = items.length; i1 > 0; --i1){
            if (!pool.includes(items[i1 - 1].tier)) continue;
            tiers[items[i1 - 1].tier].items += 1;
            tiers[items[i1 - 1].tier].chance += items[i1 - 1].chance;
        }
        this.tiers = tiers;
    }
    get(num = 1, detailed = false, pool = this.pool) {
        if (detailed) {
            const result = [];
            for(let i = num; i > 0; --i){
                result.push(this.choose(pool, detailed));
            }
            return result;
        } else {
            const result1 = [];
            for(let i1 = num; i1 > 0; --i1){
                result1.push(this.choose(pool));
            }
            return result1;
        }
    }
    choose(pool = this.pool, detailed) {
        const tier = GachaMachine.roll(this.tiers.filter((x)=>pool.includes(x.tier)).map((x)=>({
                chance: x.chance,
                result: x.tier
            })));
        const result = GachaMachine.roll(this.items.filter((x)=>x.tier == tier.result));
        return detailed ? result : result.result;
    }
    static roll(choices, totalChance) {
        let total = totalChance || 0;
        let i = 0;
        if (!total) {
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
                return choices[i];
            }
            i += 1;
        }
        return choices[Math.floor(Math.random() * choices.length)];
    }
    static createItem(result, chance = 1, tier = 1) {
        return {
            result,
            chance,
            tier
        };
    }
    static createRollChoice(result, chance = 1) {
        return {
            result,
            chance
        };
    }
}
export { GachaMachine as Fortuna };
export { GachaMachine as default };
export { GachaMachine as GachaMachine };
