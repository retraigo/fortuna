import { roll as roll1 } from "../history/algorithms/v1.ts";
import { roll as roll2 } from "../history/algorithms/v2.ts";
import { roll as roll3 } from "../history/algorithms/v3.ts";
import { roll as roll4 } from "../history/algorithms/v4.ts";
import { roll as roll4_sub } from "../history/algorithms/v4_sub.ts";

import { GachaMachine } from "../mod.ts";
import { GachaMachine as M1 } from "../history/fortuna_v1.ts";

import pokemon from "../testdata/pokemon.json" assert { type: "json" };

const items = pokemon.slice().map((x) => ({
  result: x.id,
  tier: x.tier === "legendary" ? 1 : x.tier === "mythic" ? 2 : 3,
  chance: x.tier === "legendary" ? 11 : x.tier === "mythic" ? 1 : 25,
}));

console.log(items.reduce((acc, a) => acc + a.chance, 0));

const machine = new GachaMachine(items);
const m1 = new M1(items)

console.log(machine);
console.log(machine.get(1000))

Deno.bench("nop", () => {});
/*
Deno.bench("Algorithm V1", () => {
  for (let i = 0; i < 1e1; ++i) {
    roll1(items);
  }
});

Deno.bench("Algorithm V2", () => {
  for (let i = 0; i < 1e6; ++i) {
    roll2(items);
  }
});

Deno.bench("Algorithm V3", () => {
  for (let i = 0; i < 1e6; ++i) {
    roll3(items);
  }
});

Deno.bench("Algorithm V4 _ Sub", () => {
  for (let i = 0; i < 1e6; ++i) {
    roll4_sub(items);
  }
});
*/
Deno.bench("Algorithm V4", () => {
  for (let i = 0; i < 1e6; ++i) {
    roll4(items, 3595);
  }
});
/*
Deno.bench("Algorithm V4 in Fortuna", () => {
  m1.get(1e6);
});
*/
Deno.bench("Algorithm V4 in Fortuna Roll", () => {
  for (let i = 0; i < 1e6; ++i) {
    M1.roll(items, 3695)
  }
});

Deno.bench("Fortuna V2", () => {
  machine.get(1e6);
});
