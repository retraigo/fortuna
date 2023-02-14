// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class GachaMachine {
    #items;
    #totalChance;
    constructor(items){
        this.#items = new Array(items.length);
        this.#totalChance = 0;
        this.#configItems(items);
    }
    set items(items) {
        this.#items = new Array(items.length);
        this.#totalChance = 0;
        this.#configItems(items);
    }
    #configItems(items) {
        let i = 0;
        let cumulativeChance = 0;
        while(i < items.length){
            cumulativeChance += items[i].chance;
            this.#items[i] = {
                result: items[i].result,
                cumulativeChance: cumulativeChance
            };
            i += 1;
        }
        this.#totalChance = cumulativeChance;
    }
    get(count, distinct = false) {
        if (distinct && count > this.#items.length) {
            throw new RangeError(`count must be less than number of items in pool.`);
        }
        const result = new Array(count);
        let i = 0;
        if (distinct) {
            const data = this.#items.slice(0);
            while(i < count){
                const res = rollWithBinarySearch(data);
                result[i] = data[res].result;
                data.splice(res, 1);
                i += 1;
            }
        } else {
            const data1 = this.#items;
            while(i < count){
                result[i] = data1[rollWithBinarySearch(data1)].result;
                i += 1;
            }
        }
        return result;
    }
}
function rollWithBinarySearch(items) {
    const totalChance = items[items.length - 1].cumulativeChance;
    if (items.length === 1) return 0;
    const rng = Math.random() * totalChance;
    let lower = 0;
    let max = items.length - 1;
    let mid = Math.trunc((max + lower) / 2);
    while(mid != 0 && lower <= max){
        if (items[mid].cumulativeChance > rng && items[mid - 1].cumulativeChance < rng || items[mid].cumulativeChance == rng) return mid;
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
export { GachaMachine as GachaMachine };
