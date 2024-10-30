/**
 * Toss n unbiased coins (50% chance of head / tail).
 * A biased coin can be implemented using GachaMachine.
 * Do not toss more than 62 coins at once.
 * @param n Number of coins to toss.
 * @returns Array of results. Returns "0" for head and "1" for tail.
 */
export function unbiasedCoin(n = 1): ("0" | "1")[] {
  if (n > 52) {
    const res: ("0" | "1")[][] = [];
    const times = Math.trunc(n / 52);
    const extra = n % 52;
    for (let i = 0; i < times; i += 1) {
      res.push(unbiasedCoin(52));
    }
    res.push(unbiasedCoin(extra));
    return res.flat();
  } else {
    return Array.from(
      Math.random().toString(2).slice(2, n + 2).padEnd(n, "0")
    ) as ("0" | "1")[];
  }
}
