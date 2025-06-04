/**
 * The quick solution for everything random!
 * A Gacha-like system to roll random items with weights.
 *
 * More weight = more common. Think of it as in terms of probability.
 *
 * ```js
 * // deno.land
 * import { GachaMachine } from "https://deno.land/x/fortuna/mod.ts"
 * // JSR
 * import { GachaMachine } from "jsr:@nekooftheabyss/fortuna@4.1.3"
 * // Node
 * import { GachaMachine } from "@nekooftheabyss/fortuna"
 * // esm.sh
 * import { GachaMachine } from "https://esm.sh/jsr/@nekooftheabyss/fortuna@4.1.3"
 *
 * const items = [
 *    { result: "SSR cool character", chance: 1 },
 *    { result: "Kinda rare character", chance: 3 },
 *    { result: "Mob character #1", chance: 5 },
 *    { result: "Mob character #2", chance: 5 },
 *    { result: "Mob character #3", chance: 5 },
 * ]
 *
 * const machine = new GachaMachine(items)
 *
 * machine.get(10) // Rolls 10x
 * ```
 *
 * My result:
 * ```
 * [
 *     "Kinda rare character",
 *     "Mob character #1",
 *     "Mob character #3",
 *     "Mob character #3",
 *     "Mob character #1",
 *     "Kinda rare character",
 *     "Mob character #2",
 *     "Mob character #2" ,
 *     "Mob character #1",
 *     "Mob character #2"
 * ]
 * ```
 * @module
 */

export { GachaMachine } from "./machine.ts";
export { LimitedGachaMachine } from "./limited_machine.ts";
export { rollDie } from "./die.ts";
export { roll } from "./roll.ts";
export { unbiasedCoin } from "./coin.ts";
export { rollWithPattern } from "./pattern.ts";
