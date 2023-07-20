// A biased coin can be implemented using GachaMachine.

/**
 * Toss n unbiased coins (50% chance of head / tail).
 * @param n Number of coins to toss.
 * @returns Array of results. Returns "H" for head and "T" for tail.
 */
export function unbiasedCoin(n = 1): ("H" | "T")[] {
    const upperBound = 1 << n
    const res = Math.floor(Math.random() * upperBound).toString(2).padStart(n, "0")
    return res.split("").map(x => x === "0" ? "H" : "T")
}