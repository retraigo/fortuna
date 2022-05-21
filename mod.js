// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class GachaMachine {
    items;
    tiers;
    pool;
    rawItems;
    constructor(items, pool = []){
        this.items = [];
        this.tiers = [];
        this.pool = pool;
        if (!this.pool || this.pool.length === 0) {
            this.pool = items.filter((x, i)=>items.indexOf(items.find((y)=>y.tier === x.tier
                ) || x) !== i
            ).map((x)=>x.tier
            ) || [
                1
            ];
        }
        this.pool.forEach((x)=>{
            if (!items.map((y)=>y.tier
            ).includes(x)) throw new Error(`None of the items in the machine match one or more tiers from the provided pool (${x}).`);
        });
        this.rawItems = items;
        this.configItems(items);
        this.configTiers(items);
    }
    configItems(items) {
        let newItems = items = items.sort((a, b)=>a.tier - b.tier
        ).map((x)=>({
                chance: x.featured ? x.chance + 1 : x.chance,
                result: x.result,
                tier: x.tier
            })
        );
        this.items = newItems;
        return newItems;
    }
    configTiers(items) {
        let tiers = [];
        for(let i = 0; i < this.pool.length; ++i){
            tiers[this.pool[i]] = {
                items: 0,
                chance: 0,
                tier: this.pool[i]
            };
        }
        for(let i1 = items.length; i1 > 0; --i1){
            if (!this.pool.includes(items[i1 - 1].tier)) continue;
            tiers[items[i1 - 1].tier].items += 1;
            tiers[items[i1 - 1].tier].chance += items[i1 - 1].chance;
        }
        let tierList = [];
        for(let i2 in tiers){
            tierList.push(tiers[i2]);
        }
        this.tiers = tierList;
        return tierList;
    }
    get(num = 1, detailed = false, pool = []) {
        if (pool.length > 0) {
            const newMachine = new GachaMachine(this.rawItems, pool);
            return newMachine.get(num, detailed);
        }
        let result = [];
        for(let i = num; i > 0; --i){
            result.push(this._get(detailed));
        }
        return result;
    }
    _get(detailed = false) {
        let tier = GachaMachine._roll(this.tiers.map((x)=>({
                chance: x.chance,
                result: x.tier
            })
        ));
        const result = GachaMachine._roll(this.items.filter((x)=>x.tier == tier.result
        ));
        return detailed ? result : result.result;
    }
    static _roll(choices) {
        let filteredChoices = [];
        let total = 0;
        for(let i = 0; i < choices.length; ++i){
            if (choices[i].chance > 0) {
                filteredChoices.push(choices[i]);
                total += choices[i].chance;
            }
        }
        let result = Math.random() * total;
        let going = 0;
        for(let i3 = 0; i3 < filteredChoices.length; ++i3){
            going += filteredChoices[i3].chance;
            if (result < going) {
                return filteredChoices[i3];
            }
        }
        return filteredChoices[Math.floor(Math.random() * filteredChoices.length)];
    }
    static createItem(result, chance = 1, tier = 1, featured = false) {
        return {
            result,
            chance,
            tier,
            featured
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
