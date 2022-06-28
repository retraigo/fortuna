import { GachaMachine } from "./mod.ts";
import { assertAlmostEquals } from "https://deno.land/std@0.145.0/testing/asserts.ts";

import { Duration } from "https://deno.land/x/durationjs@v3.1.1/mod.ts";

import pokemon from "./testdata/pokemon.json" assert { type: "json" };

function countDupes(arr: string[]): Record<string, number> {
  let items: Record<string, number> = {};
  arr.forEach((v, i) => {
    if (items[v]) items[v]++;
    else items[v] = 1;
  });
  return items;
}

const timeStart = performance.now();

const items = pokemon.slice(0, 151).map((x) => ({
  result: x.id,
  id: x.id,
  tier: x.tier === "legendary" ? 3 : x.tier === "mythic" ? 2 : 1,
  chance: x.tier === "legendary" ? 10 : x.tier === "mythic" ? 1 : 25,
  weight: x.tier === "legendary" ? 10 : x.tier === "mythic" ? 1 : 25,
}));

const timeConfig = performance.now();

const machine = new GachaMachine(items);

const timeInit = performance.now();

const res = machine.get(1000000, false, [1, 2, 3]);

const timeRoll = performance.now();

const dupes = countDupes(res.map((x) => String(x)));

const timeReduce = performance.now();

console.log(
  Object.entries(dupes).map((x) => {
    const pk = pokemon.find((y) => y.id === Number(x[0]));
    return { name: pk?.name, count: x[1], tier: pk?.tier };
  }).sort((a, b) => a.count - b.count).reverse().map((x) =>
    `Name: ${x.name}\nRate: ${x.count / 10000}%\nTier: ${x.tier}`
  ).join("\n\n"),
);

// TESTS

Deno.test("Range Check", () => {
  Object.entries(dupes).map((x) => {
    const pk = pokemon.find((y) => y.id === Number(x[0]));
    return { name: pk?.name, count: x[1], tier: pk?.tier };
  }).sort((a, b) => a.count - b.count).reverse().forEach((x) => {
    if (x.tier === "normal") assertAlmostEquals(x.count / 10000, 0.67, 4e-2);
    else if (x.tier === "legendary") {
      assertAlmostEquals(x.count / 10000, 0.26, 4e-2);
    } else if (x.tier === "mythic") {
      assertAlmostEquals(x.count / 10000, 0.03, 4e-2);
    }
  });
});
// TESTS END

console.log("-----REPORT-----");
console.log(
  "Time taken to configure:",
  Duration.between(timeConfig, timeStart).stringify(
    ["s", "ms", "us", "ns"],
    true,
  ),
);
console.log(
  "Time taken to setup machine:",
  Duration.between(timeConfig, timeInit).stringify(
    ["s", "ms", "us", "ns"],
    true,
  ),
);
console.log(
  "Time taken to roll 1000000 items:",
  Duration.between(timeInit, timeRoll).stringify(["s", "ms", "us", "ns"], true),
);
console.log(
  "Time taken to reduce data into result:",
  Duration.between(timeReduce, timeRoll).stringify(
    ["s", "ms", "us", "ns"],
    true,
  ),
);
