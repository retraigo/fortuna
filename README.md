# fortuna v2

Weighted gacha system.

## Usage

Create an item using `GachaMachine.createItem`

More weight = more common. Think of it as in terms of probability.

```js

import { GachaMachine } from "https://deno.land/x/fortuna/mod.ts"
// or
import { GachaMachine } from "https://deno.land/x/fortuna/dist/fortuna.js"

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character #1", chance: 5 },
    { result: "Mob character #2", chance: 5 },
    { result: "Mob character #3", chance: 5 },


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

### Plain weighted random selection

You probably don't need all complicated stuff. Here's a quick way to just create a simple weight-based gacha system:
(Only works on v3.0.1 and above)

```ts
import { roll } from "https://deno.land/x/fortuna/src/roll.ts"; // wherever you are importing from.

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
import { roll } from "https://deno.land/x/fortuna/src/roll.ts"; // wherever you are importing from.

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
import { roll } from "https://deno.land/x/fortuna/src/roll.ts"; // wherever you are importing from.

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
import { roll } from "https://deno.land/x/fortuna/src/roll.ts"; // wherever you are importing from.

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

Documentation for the latest version can be found in [https://doc.deno.land/https://deno.land/x/fortuna/mod.ts](https://doc.deno.land/https://deno.land/x/fortuna/mod.ts)

A guide for usage can be found in [docs.nekooftheabyss.moe](https://docs.nekooftheabyss.moe/fortuna) (not updated for v3 yet).
