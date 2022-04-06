---
title: Advanced Usage
description: "Advanced usage of fortuna to create a weighted gacha system."
position: 4
category: Guide
menuTitle: Advanced
---

## Multiple rolls (basic)

```ts
const items = [
    GachaMachine.createItem("SSR cool character", 1),
    GachaMachine.createItem("Kinda rare character", 3),
    GachaMachine.createItem("Mob character", 5),
    GachaMachine.createItem("Mob character", 5),
    GachaMachine.createItem("Mob character", 5),
  }
]

// Create a gacha machine instance
const machine = new GachaMachine(items)

// Roll 10x
machine.get(10)
```

**Sample result**

```ts
[
  "Kinda rare character",
  "Mob character",
  "Mob character",
  "Mob character",
  "Mob character",
  "Kinda rare character",
  "Mob character",
  "Mob character",
  "Mob character",
  "Mob character",
];
```

### Display chance with roll

```ts
const machine = new GachaMachine(items);

// Roll 10x with detailed=true
machine.get(10, true);
```

**Sample result**

```ts
[
  { result: "Kinda rare character", chance: 3 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Kinda rare character", chance: 3 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
  { result: "Mob character", chance: 5 },
];
```

## Roll with Tiers

Sometimes you create a gacha machine with many items but want to roll from a smaller pool. For this, you can make use of the `tier` parameter which groups your items.

**Usage**
```ts
GachaMachine.createItem(result, chance, tier)
```

```ts
const items = [
  GachaMachine.createItem("SSR cool character", 1, 2),
  GachaMachine.createItem("Rare cool character", 5, 2),
  GachaMachine.createItem("Kinda rare character", 8, 1),
  GachaMachine.createItem("Mob character 1", 10, 1),
  GachaMachine.createItem("Mob character 2", 10, 1),
  GachaMachine.createItem("Mob character 3", 10, 1),
]

const machine = new GachaMachine(items)

// Rolls 10x from any of the six items
machine.get(10, false)

// Rolls 10x only between the SSR character and the rare character
machine.get(10, false, [2])
```

We are passing an array of tiers to roll from in the last parameter. Keeping it blank will roll from every tier. 

Attempting to provide a pool that includes a tier with no items in it would throw an error.

```ts
machine.get(5, false, [2, 9])
// error: Uncaught Error: None of the items in the machine match one or more tiers from the provided pool (9).
```