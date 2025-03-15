import { roll } from "./roll.ts";

type Pattern = "exponential" | "fibonacci";

/** 
 * Perform random selection with weights that decrease in a 
 * fibonacci way. Do not use this for large arrays (n > 100).
 */
export function rollWithPattern<T>(arr: T[], pattern: "fibonacci"): T
/**
 * Perform random selection with weights that exponentially
 * decrease. 
 */
export function rollWithPattern<T>(arr: T[], pattern: "exponential"): T
export function rollWithPattern<T>(arr: T[], pattern: Pattern): T {
    switch(pattern) {
        case "exponential":
            return chooseHalving(arr)
        case "fibonacci":
            return chooseFibonacci(arr)
    }
}

export function chooseHalving<T>(arr: T[]): T {
  const iter = arr.values();
  let result = iter.next().value;
  // allow array to have null values
  while (typeof result !== "undefined") {
    if (Math.random() > 0.5) return result;
    result = iter.next().value
  }
  return arr[arr.length - 1];
}

export function chooseFibonacci<T>(arr: T[]): T {
    const chances = _fibonacci(arr.length - 1);
    return roll(arr, chances[0], chances[1]);
}

function _fibonacci(req: number): [number[], number] {
  if (req <= 2) return [[], 0];
  const n = new Array(req);
  let [a, b] = [n[req - 1], n[req - 2]] = [1, 1];
  req -= 2;  
  let c: number;
  let sum = 0;
  for (req; req > 0; --req) {
    c = a + b;
    n[req - 1] = c;
    a = b;
    b = c;
    sum += c;
  }

  return [n, sum];
}

console.log(_fibonacci(99))