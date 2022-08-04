import { roll as roll1 } from "../algorithms/v1.ts";
import { roll as roll2 } from "../algorithms/v2.ts";
import { roll as roll3 } from "../algorithms/v3.ts";
import { roll as roll4 } from "../algorithms/v4.ts";
import { roll as roll4_sub } from "../algorithms/v4_sub.ts";
import { GachaMachine } from "../mod.ts";

import pokemon from "../testdata/pokemon.json" assert { type: "json" };

const items = pokemon.slice(0, 151).map((x) => ({
  result: x.id,
  chance: x.tier === "legendary" ? 11 : x.tier === "mythic" ? 1 : 25,
}));

Deno.bench("nop", () => {});

Deno.bench("Algorithm V1", () => {
  for (let i = 0; i < 1e2; ++i) {
    roll1(items);
  }
});

Deno.bench("Algorithm V2", () => {
  for (let i = 0; i < 1e2; ++i) {
    roll2(items);
  }
});

Deno.bench("Algorithm V3", () => {
  for (let i = 0; i < 1e2; ++i) {
    roll3(items);
  }
});

Deno.bench("Algorithm V4 _ Sub", () => {
  for (let i = 0; i < 1e2; ++i) {
    roll4_sub(items);
  }
});

Deno.bench("Algorithm V4", () => {
  for (let i = 0; i < 1e2; ++i) {
    roll4(items);
  }
});

Deno.bench("Algorithm V4 in Fortuna", () => {
  for (let i = 0; i < 1e2; ++i) {
    GachaMachine.roll(items);
  }
});
