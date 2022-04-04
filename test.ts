import { GachaMachine } from "./mod.ts";
import { default as genString } from "https://deno.land/x/lala@v2.1.2/functions/generator/string/index.js";
/*
const items = [];
for (let i = 0; i < 100; ++i) {
  items.push({
    chance: Math.ceil(Math.random() * 12),
    result: genString(7),
    tier: 1,
    featured: false,
  });
}

const machine = new GachaMachine(items, [1]);
console.log(machine)

console.log(machine.get(5, true));
*/
const items = [
  GachaMachine.createItem("SSR cool character", 1),
  GachaMachine.createItem("Kinda rare character", 3),
  GachaMachine.createItem("Mob character", 5),
  GachaMachine.createItem("Mob character", 5),
  GachaMachine.createItem("Mob character", 5),
]

const machine = new GachaMachine(items)

console.log(machine.get(10)) // Rolls 10x 