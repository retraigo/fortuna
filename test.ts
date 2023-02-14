import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.157.0/testing/asserts.ts";
import { GachaMachine, roll } from "./mod.ts";

const testData = [
  { result: "SSR cool character", chance: 1 },
  { result: "Kinda rare character", chance: 3 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
];

Deno.test({
  name: "Is GachaMachine defined?",
  fn() {
    const machine = new GachaMachine(testData);
    assertExists(machine);
  },
});

Deno.test({
  name:
    "Is the initialization time less than 200 + (number of elements / 3) microseconds?",
  fn() {
    const t1 = performance.now();
    new GachaMachine(testData);
    const t2 = performance.now();
    assert((t2 - t1) * 100 < 200 + (testData.length / 3));
  },
});

Deno.test({
  name: `Roll 3 unique items from a collection of 5 items`,
  fn() {
    const machine = new GachaMachine(testData);
    const res = machine.get(3, true);
    assertExists(res);
  },
});

Deno.test({
  name: `Roll 5 unique items from a collection of 5 items`,
  fn() {
    const machine = new GachaMachine(testData);
    const res = machine.get(5, true);
    assertArrayIncludes(res, [
      "SSR cool character",
      "Kinda rare character",
      "Mob character",
      "Mob character",
      "Mob character",
    ]);
  },
});

Deno.test({
  name: `Roll 7 unique items from a collection of 5 items (throw error)`,
  fn() {
    const machine = new GachaMachine(testData);
    assertThrows(() => machine.get(7, true));
  },
});

Deno.test({
  name:
    `Roll 7 non-unique items from a collection of 5 items (don't throw error)`,
  fn() {
    const machine = new GachaMachine(testData);
    const res = machine.get(7);
    assertEquals(res.length, 7);
  },
});

Deno.test({
  name:
    `Machine can be updated by just setting machine.items after initialization.`,
  fn() {
    const machine = new GachaMachine(testData);

    const machine2 = new GachaMachine(testData.slice(0, 3));

    machine.items = testData.slice(0, 3);

    assertEquals(machine.items, machine2.items, "Items are not equal.");
    //    assertEquals(machine.tiers, machine2.tiers, "Tiers are not equal.");
    //    assertEquals(machine.totalChance, machine2.totalChance, "totalChance are not equal.");
    //    assertEquals(machine.maxTier, machine2.maxTier, "maxTier are not equal.");
    //    assertEquals(machine.pool, machine2.pool, "pool are not equal.");
  },
});

Deno.test({
  name: `Roll 1 items from a collection of 5 items using the roll() method`,
  fn() {
    const res = roll(testData);
    console.log(`Rolled: `, res);
    assertExists(res);
  },
});

Deno.test({
  name:
    `Roll 1 items from a collection of 5 items using the roll() method (overload)`,
  fn() {
    const res = roll(
      testData.map((x) => x.result),
      testData.map((x) => x.chance),
    );
    console.log(`Rolled: `, res);
    assertExists(res);
  },
});

/*
Deno.test({
    name: `${sortedTestData[0].chance} in ${testData.reduce((acc, val) => acc + val.chance, 0)} rolls return a ${sortedTestData[0].result}?`,
    fn() {
      const machine = new GachaMachine(testData);
      const res = machine.get(testData.reduce((acc, val) => acc + val.chance, 0));
      assertArrayIncludes(res, sortedTestData[0].result)
    },
});
*/
