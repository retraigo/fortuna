# fortuna
Weighted gacha system.

## Usage

Create an item using `GachaMachine.createItem`

More weight = more common
```js
const items = [
    GachaMachine.createItem("SSR cool character", 1),
    GachaMachine.createItem("Kinda rare character", 3),
    GachaMachine.createItem("Mob character", 5),
    GachaMachine.createItem("Mob character", 5),
    GachaMachine.createItem("Mob character", 5),
  }
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
import fortuna from 'xxx' // wherever you are importing from. 

const items = [
    GachaMachine.createRollChoice("SSR cool character", 1),
    GachaMachine.createRollChoice("Kinda rare character", 3),
    GachaMachine.createRollChoice("Mob character", 5),
    GachaMachine.createRollChoice("Mob character", 5),
    GachaMachine.createRollChoice("Mob character", 5),
]

GachaMachine._roll(items) // Rolls one item from the list of items
```

### Alternatively...
`GachaMachine.createRollChoice` just returns an object with `result` and `chance`.
```ts
import fortuna from 'xxx' // wherever you are importing from. 

const items = [
    {result: "SSR cool character", chance: 1},
    {result: "Kinda rare character", chance: 3},
    {result: "Mob character", chance: 5},
    {result: "Mob character", chance: 5},
    {result: "Mob character", chance: 5},
]

GachaMachine._roll(items) // Rolls one item from the list of items
```


## Documentation
Documentation for the latest version can be found in [https://doc.deno.land/https://deno.land/x/fortuna/mod.ts](https://doc.deno.land/https://deno.land/x/fortuna/mod.ts)

A guide for usage can be found in [fortuna.nekooftheabyss.xyz](https://fortuna.nekooftheabyss.xyz)
