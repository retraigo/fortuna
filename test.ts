import { GachaMachine } from "./mod.ts";
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
  GachaMachine.createItem("SSR cool character", 1, 2),
  GachaMachine.createItem("Rare cool character", 5, 2),
  GachaMachine.createItem("Kinda rare character", 8, 1),
  GachaMachine.createItem("Mob character 1", 10, 1),
  GachaMachine.createItem("Mob character 2", 10, 1),
  GachaMachine.createItem("Mob character 3", 10, 1),
]

const machine = new GachaMachine(items)

console.log(machine.get(10, false, [5])) // Rolls 10x 