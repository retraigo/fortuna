import { unbiasedCoin } from "../mod.ts";

const nTrials = 590

Deno.bench({
    name: "Fortuna Coin",
    baseline: true,
    fn() {
        unbiasedCoin(nTrials)
    }
})

Deno.bench({
    name: "Math.random()",
    fn() {
        const res = [];
        for (let i = 0; i < nTrials; i += 1) {
            res.push(Math.random() < 0.5 ? "H" : "T")
        }
    }
})