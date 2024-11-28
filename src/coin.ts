/**
 * Toss n unbiased coins (50% chance of head / tail).
 * A biased coin can be implemented using GachaMachine.
 * Do not toss more than 62 coins at once.
 * @param n Number of coins to toss.
 * @returns Array of results. Returns "0" for head and "1" for tail.
 */
export function unbiasedCoin(n = 1): ("0" | "1")[] {
  if (n > 62) {
    const res: ("0" | "1")[][] = [];
    const times = Math.trunc(n / 62);
    const extra = n % 62;
    for (let i = 0; i < times; i += 1) {
      res.push(unbiasedCoin(62));
    }
    res.push(unbiasedCoin(extra));
    return res.flat();
  } else {
    let rand = Math.random() * (1 << 62) - 1
    const res = new Array(n);
    for (let i = 0; i < n; i += 1) {
      res[i] = (rand & 1) ? "T" : "H";
      rand >>= 1;
    }
    return res;
  }
}

console.log(unbiasedCoin(200).join(""))
