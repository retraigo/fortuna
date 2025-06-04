# Fortuna
The quick solution for everything random!

A Gacha-like system to roll random items with weights.

## Usage

More weight = more common. Think of it as in terms of probability.

```js
// Deno
import { GachaMachine } from "https://deno.land/x/fortuna/mod.ts"
// JSR
import { GachaMachine } from "jsr:@nekooftheabyss/fortuna@4.2.0"
// Node
import { GachaMachine } from "@nekooftheabyss/fortuna"
// esm.sh
import { GachaMachine } from "https://esm.sh/jsr/@nekooftheabyss/fortuna@4.2.0"

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character #1", chance: 5 },
    { result: "Mob character #2", chance: 5 },
    { result: "Mob character #3", chance: 5 },
]

const machine = new GachaMachine(items)

machine.get(10) // Rolls 10x

/*
    My result:
    [
      "Kinda rare character",
      "Mob character #1",
      "Mob character #3",
      "Mob character #3",
      "Mob character #1",
      "Kinda rare character",
      "Mob character #2",
      "Mob character #2" ,
      "Mob character #1",
      "Mob character #2"
    ]
*/
```

### Rolling distinct elements
You can roll distinct elements using the `LimitedGachaMachine`. It is slower
than `GachaMachine` but there shouldn't be much noticeable difference.

The "distinct" behavior only applies to within a single `.get()` call. It
doesn't affect the pool of items used when initializing `new LimitedGachaMachine()`.

```js

import { LimitedGachaMachine } from "https://deno.land/x/fortuna/mod.ts"
// JSR
import { LimitedGachaMachine } from "jsr:@nekooftheabyss/fortuna@4.2.0"

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character #1", chance: 5 },
    { result: "Mob character #2", chance: 5 },
    { result: "Mob character #3", chance: 5 },
]

const machine = new LimitedGachaMachine(items)

machine.get(4) // Rolls 4x

/*
    My result:
    [
      "Kinda rare character",
      "Mob character #1",
      "Mob character #3",
      "Mob character #2",
    ]
*/
```

### Plain weighted random selection

You probably don't need all complicated stuff. Here's a quick way to just create a simple weight-based gacha system:
(Only works on v3.0.1 and above)

```ts
import { roll } from "jsr:@nekooftheabyss/fortuna@4.2.0/roll"; // wherever you are importing from.

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character #1", chance: 5 },
    { result: "Mob character #2", chance: 5 },
    { result: "Mob character #3", chance: 5 },
];

roll(items); // Rolls one item from the list of items using linear search.
```

You can also provide two individual arrays for choices and weights.

```ts
import { roll } from "jsr:@nekooftheabyss/fortuna@4.2.0/roll"; // wherever you are importing from.

const items = [
    "SSR cool character",
    "Kinda rare character",
    "Mob character #1",
    "Mob character #2",
    "Mob character #3",
];
const chances = [1, 3, 5, 5, 5];

roll(items, chances); // Rolls one item from the list of items using linear search.
```

Providing the total chance may result in faster rolls.

```ts
import { roll } from "jsr:@nekooftheabyss/fortuna@4.2.0/roll"; // wherever you are importing from.

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character #1", chance: 5 },
    { result: "Mob character #2", chance: 5 },
    { result: "Mob character #3", chance: 5 },
];

roll(items, 19); // Rolls one item from the list of items using linear search.
```

```ts
import { roll } from "jsr:@nekooftheabyss/fortuna@4.2.0/roll"; // wherever you are importing from.

const items = [
    "SSR cool character",
    "Kinda rare character",
    "Mob character #1",
    "Mob character #2",
    "Mob character #3",
];
const chances = [1, 3, 5, 5, 5];

roll(items, chances, 19); // Rolls one item from the list of items using linear search.
```

## Documentation

Documentation for the latest version can be found in [jsr:@nekooftheabyss/fortuna](https://jsr.io/@nekooftheabyss/fortuna)