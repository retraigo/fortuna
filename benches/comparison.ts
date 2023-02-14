/**
 * Each module picks 1e4 items from the gacha pool.
 * Total weight of pool: 21663
 * Total number of items in pool: 905
 */

import { GachaMachine, roll } from "../mod.ts";

import pokemon from "../testdata/pokemon.json" assert { type: "json" };

import { RandomPicker } from "https://deno.land/x/wrand@v1.1.0/mod.ts";

import wrs from "https://esm.sh/weighted-randomly-select@1.0.6";

import rwc from "https://esm.sh/random-weighted-choice@0.1.4";

import { select } from "https://deno.land/x/masx200_weighted_randomly_select@2.1.1/mod.ts";

const items = pokemon.slice().map((x) => ({
  result: x.id,
  tier: x.tier === "legendary" ? 1 : x.tier === "mythic" ? 2 : 3,
  chance: x.tier === "legendary" ? 11 : x.tier === "mythic" ? 1 : 25,
}));

const itemsForPicker = items.map((x) => ({
  original: x.result,
  weight: x.chance,
}));
const itemsForRWC = items.map((x) => ({ id: x.result, weight: x.chance }));

const totalChance = items.reduce((acc, a) => acc + a.chance, 0);

/**
 * No op
 */
Deno.bench("nop", () => {});

/**
 * First one I could find on /x
 */
Deno.bench("masx200/weighted-randomly-select", { group: "gacha" }, () => {
  for (let i = 0; i < 1e4; ++i) {
    select(items);
  }
});

/**
 * This was the one that inspired me to write fortuna iirc.
 */
Deno.bench("Rifdhan/weighted-randomly-select", { group: "gacha" }, () => {
  for (let i = 0; i < 1e4; ++i) {
    wrs.select(items);
  }
});

/**
 * I don't really know how rwc works.
 */
Deno.bench("parmentf/random-weighted-choice", { group: "gacha" }, () => {
  for (let i = 0; i < 1e4; ++i) {
    rwc(itemsForRWC);
  }
});

/**
 * Initializing class is done in the bench too
 * to avoid bias.
 */
Deno.bench("Balastrong/wrand", { group: "gacha" }, () => {
  const picker = new RandomPicker(itemsForPicker);
  picker.pickMany(1e4);
});

/**
 * Initializing class is done in the bench too
 * to avoid bias.
 */
Deno.bench("retraigo/fortuna", { baseline: true, group: "gacha" }, () => {
  const machine = new GachaMachine(items);
  machine.get(1e4);
});

/** 
 * Plain rolls without requiring any setup
 */
Deno.bench("retraigo/fortuna/roll", {  group: "gacha" }, () => {
  for (let i = 0; i < 1e4; ++i) {
    roll(items);
  }
});

/** 
 * Plain rolls without requiring any setup
 * with totalChance
 */
Deno.bench("retraigo/fortuna/roll (with totalChance)", {  group: "gacha" }, () => {
  for (let i = 0; i < 1e4; ++i) {
    roll(items, totalChance);
  }
});
