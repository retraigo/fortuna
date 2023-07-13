// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class GachaMachine {
    #items;
    #weights;
    #alias;
    #totalChance;
    constructor(items){
        this.#items = new Array(items.length);
        this.#alias = new Array(items.length);
        this.#weights = new Array(items.length);
        this.#totalChance = 0;
        this.#configItems(items);
    }
    set items(items) {
        this.#items = new Array(items.length);
        this.#configItems(items);
    }
    #configItems(items) {
        this.#alias.fill(-1);
        this.#weights.fill(-1);
        let i = 0;
        while(i < items.length){
            this.#totalChance += items[i].chance;
            i += 1;
        }
        i = 0;
        const multiplier = items.length / this.#totalChance;
        const __long = [], small = [];
        while(i < items.length){
            const prob = items[i].chance * multiplier;
            if (prob > 1) __long.push(i);
            else small.push(i);
            this.#items[i] = items[i].result;
            this.#weights[i] = prob;
            i += 1;
        }
        while(__long.length && small.length){
            const j = small.pop();
            const k = __long.at(-1);
            if (j === undefined || k === undefined) {
                throw new Error("This definitely shouldn't happen. Open an issue at https://github.com/retraigo/fortuna");
            }
            this.#alias[j] = k;
            this.#weights[k] -= 1 - this.#weights[j];
        }
    }
    get(count) {
        let i = 0;
        const res = new Array(count);
        while(i < count){
            res[i] = this.#items[this.#roll()];
            i += 1;
        }
        return res;
    }
    #roll() {
        const inter = Math.random() * this.#items.length;
        const i = ~~inter;
        const y = inter - i;
        return y < this.#weights[i] ? i : this.#alias[i];
    }
}
export { GachaMachine as GachaMachine };
