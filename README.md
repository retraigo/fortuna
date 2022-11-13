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

## How it works

Fortuna has two algorithms, one being a static method in the `GachaMachine` class and one
being a standalone function.

### Algorithm 1

Fortuna provides a simple function `roll` that generates a pseudo random number
and performs linear search on the provided data in order to find the proper item.

```ts
// JS PSEUDOCODE

// Each choice is an object with 
//     chance: number
//     result: T (type parameter)
// 
// total chance can be supplied
// manually or computed from data
function roll(choices, total) {
    // runs a loop to compute total
    if(!total) total = sum_by_chance(data)

    // generate random number for choosing
    let rng = random_number(0, total)

    // run a loop to find the choice
    let current = 0.0;
    for (choice in data) {
        current = current + choice.chance;
        if(rng < current) return choice.result;
    }
}
```

Fortuna's default `GachaMachine.get()` uses a more complex, but faster approach.

- When the `GachaMachine` class is instantiated, data is transformed into a form
  suitable for binary search.

- When `GachaMachine.get()` is run, Fortuna performs binary search on this transformed
  data.

The `roll` function is more suitable when the weighted data is used only once.

The `get` method is suitable when the weighted data is reused. It comes at extra cost 
during initialization but compensates for it with better performance when sampling.

## Documentation
Documentation for the latest version can be found in [https://doc.deno.land/https://deno.land/x/fortuna/mod.ts](https://doc.deno.land/https://deno.land/x/fortuna/mod.ts)

A guide for usage can be found in [docs.nekooftheabyss.moe](https://docs.nekooftheabyss.moe/fortuna) (not updated for v3 yet).

