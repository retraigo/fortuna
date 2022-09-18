# fortuna v2
Weighted gacha system.

## Usage

Create an item using `GachaMachine.createItem`

More weight = more common
```js
const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
]

const machine = new GachaMachine(items)

machine.get(10) // Rolls 10x 

/*
    My result:
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
      "Mob character"
    ]
*/
```

### Plain weighted random selection
You probably don't need all complicated stuff. Here's a quick way to just create a simple weight-based gacha system:
(Only works on v1.1.0 and above)

```ts
import { GachaMachine } from 'https://deno.land/x/fortuna/mod.ts' // wherever you are importing from. 

const items = [
    { result: "SSR cool character", chance: 1 },
    { result: "Kinda rare character", chance: 3 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
    { result: "Mob character", chance: 5 },
]

GachaMachine.rollWithLinearSearch(items) // Rolls one item from the list of items using linear search.
```

`GachaMachine#get()` works using Binary Search by default. Using the Binary Search method explicitly requires a different structure of data for input.

```ts
import { GachaMachine } from 'https://deno.land/x/fortuna/mod.ts' // wherever you are importing from. 

const items = [
    { result: "SSR cool character", cumulativeChance: 1 },
    { result: "Kinda rare character", cumulativeChance: 4 },
    { result: "Mob character", cumulativeChance: 9 },
    { result: "Mob character", cumulativeChance: 14 },
    { result: "Mob character", cumulativeChance: 19 },
]

GachaMachine.rollWithBinarySearch(items) // Rolls one item from the list of items using linear search.
```


## Documentation
Documentation for the latest version can be found in [https://doc.deno.land/https://deno.land/x/fortuna/mod.ts](https://doc.deno.land/https://deno.land/x/fortuna/mod.ts)

A guide for usage can be found in [docs.nekooftheabyss.moe](https://docs.nekooftheabyss.moe/fortuna) (not updated for v2 yet).

