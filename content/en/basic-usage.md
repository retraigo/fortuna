---
title: Basic Usage
description: "Basic usage of fortuna to create a weighted gacha system."
position: 3
category: Guide
---

## Simple Weighted Selection

```ts
const items = [
    GachaMachine.createRollChoice("SSR cool character", 1),
    GachaMachine.createRollChoice("Kinda rare character", 3),
    GachaMachine.createRollChoice("Mob character", 5),
    GachaMachine.createRollChoice("Mob character", 5),
    GachaMachine.createRollChoice("Mob character", 5),
]

GachaMachine._roll(items) // Rolls one item from the list of items
```

The `createRollChoice` method returns an object with `result` and `chance`. You can alternatively do:

```ts
const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
]

GachaMachine._roll(items) // Rolls one item from the list of items
```