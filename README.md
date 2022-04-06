# fortuna
Weighted gacha system.

### Usage

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

### Documentation
Documentation for the latest version can be found in [https://doc.deno.land/https://deno.land/x/fortuna/mod.ts](https://doc.deno.land/https://deno.land/x/fortuna/mod.ts)
