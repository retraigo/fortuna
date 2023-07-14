import {
  assert,
  assertArrayIncludes,
  assertEquals,
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.190.0/testing/asserts.ts";
import { GachaMachine, LimitedGachaMachine, roll, rollDie } from "./mod.ts";

const testData = [
  { result: "SSR cool character", chance: 1 },
  { result: "Kinda rare character", chance: 3 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
];

Deno.test({
  name: "V4: Is GachaMachine defined?",
  fn() {
    const machine = new GachaMachine(testData);
    assertExists(machine);
  },
});

Deno.test({
  name: "V3: Is GachaMachine defined?",
  fn() {
    const machine = new LimitedGachaMachine(testData);
    assertExists(machine);
  },
});

Deno.test({
  name: `V3: Roll 3 unique items from a collection of 5 items`,
  fn() {
    const machine = new LimitedGachaMachine(testData);
    const res = machine.get(3);
    assertExists(res);
  },
});

Deno.test({
  name: `V3: Roll 5 unique items from a collection of 5 items`,
  fn() {
    const machine = new LimitedGachaMachine(testData);
    const res = machine.get(5);
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
  name: `V3: Roll 7 unique items from a collection of 5 items (throw error)`,
  fn() {
    const machine = new LimitedGachaMachine(testData);
    assertThrows(() => machine.get(7));
  },
});

Deno.test({
  name: `V4: Roll 7 non-unique items from a collection of 5 items`,
  fn() {
    const machine = new GachaMachine(testData);
    const res = machine.get(7);
    assertEquals(res.length, 7);
  },
});

Deno.test({
  name:
    `V4: Machine can be updated by just setting machine.items after initialization.`,
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
  name:
    `V3: Machine can be updated by just setting machine.items after initialization.`,
  fn() {
    const machine = new LimitedGachaMachine(testData);

    const machine2 = new LimitedGachaMachine(testData.slice(0, 3));

    machine.items = testData.slice(0, 3);

    assertEquals(machine.items, machine2.items, "Items are not equal.");
    //    assertEquals(machine.tiers, machine2.tiers, "Tiers are not equal.");
    //    assertEquals(machine.totalChance, machine2.totalChance, "totalChance are not equal.");
    //    assertEquals(machine.maxTier, machine2.maxTier, "maxTier are not equal.");
    //    assertEquals(machine.pool, machine2.pool, "pool are not equal.");
  },
});

Deno.test({
  name:
    `Single Roll: Roll 1 items from a collection of 5 items using the roll() method`,
  fn() {
    const res = roll(testData);
    console.log(`Rolled: `, res);
    assertExists(res);
  },
});

Deno.test({
  name:
    `Single Roll: Roll 1 items from a collection of 5 items using the roll() method (overload)`,
  fn() {
    const res = roll(
      testData.map((x) => x.result),
      testData.map((x) => x.chance),
    );
    console.log(`Rolled: `, res);
    assertExists(res);
  },
});

Deno.test({
  name: `Roll a simple die once`,
  fn() {
    const res = rollDie();
    console.log(`Die Rolled: `, res);
    assert(typeof res === "number" && res >= 1 && res <= 6);
  },
});

Deno.test({
  name: `Roll 3 simple dice`,
  fn() {
    const res = rollDie({ times: 3, face: 6, separate: true });
    console.log(`Die Rolled: `, res);
    assert(Array.isArray(res) && res.every((x) => x >= 1 && x <= 6));
  },
});

Deno.test({
  name: `Roll 3 simple dice and sum all rolls`,
  fn() {
    const res = rollDie({ times: 3, face: 6 });
    console.log(`Die Rolled: `, res);
    assert(typeof res === "number" && res >= 3 && res <= 18);
  },
});

Deno.test({
  name: `Roll 6d9 and sum all rolls`,
  fn() {
    const res = rollDie("6d9");
    console.log(`Die Rolled: `, res);
    assert(typeof res === "number" && res >= 6 && res <= 54);
  },
});

Deno.test({
  name: `Roll 6d9 with a +12 modifier`,
  fn() {
    const res = rollDie("6d9+12");
    console.log(`Die Rolled: `, res);
    assert(typeof res === "number" && res >= 18 && res <= 66);
  },
});

Deno.test({
  name: `Attempt to roll 6dd (should throw)`,
  fn() {
    assertThrows(() => rollDie("6dd"));
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
