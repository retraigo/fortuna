/** Config to define a die */
type DieConfig = {
  /** Number of times the die rolls */
  times: number;
  /** Number of faces the die has */
  face: number;
  /** A + or - modifier to the roll */
  modifier: number;
}

function parseExpression(exp: string): DieConfig {
  const matches = /^\s*(\d*)\s*d\s*(\d+)\s*([-+])*\s*(\d*)\s*$/.exec(exp);
  if (!matches) {
    throw new Error(
      `Die Expression ${exp} is not of the format <count>d<faces> (eg. 2d10)`,
    );
  }
  const times = Number(matches[1]);
  const face = Number(matches[2]);
  let modifier = Number(matches[4]);
  if (matches[3] === "-") modifier *= -1;
  else if (!matches[3]) modifier = 0;
  if (isNaN(face)) {
    throw new Error(
      `Die Expression ${exp} is not of the format <count>d<faces> (eg. 2d10)`,
    );
  } else {
    return { times: times || 1, face, modifier: modifier || 0 };
  }
}

/** Config to roll a die */
export type RollOptions = Partial<DieConfig> & {
  /** Whether to consider each roll separately or add them */
  separate?: boolean;
}
const defaultRollOptions: RollOptions = {
  times: 1,
  face: 6,
  separate: false,
  modifier: 0,
};

/**
 * Roll an unbiased die. 
 * A biased die can be implemented using GachaMachine.
 * @param exp Die expression
 * @param separate whether to consider each roll individually
 */
export function rollDie(exp: string, separate: true): number[];
/**
 * Roll an unbiased die. 
 * A biased die can be implemented using GachaMachine.
 * @param exp Die expression
 * @param separate whether to consider each roll individually
 */
export function rollDie(exp: string, separate?: false): number;
/**
 * Roll an unbiased die.
 * A biased die can be implemented using GachaMachine.
 * @param options Options for rolling the die.
 */
export function rollDie(options: RollOptions): number | number[];
/**
 * Roll a simple unbiased 6-faced die.
 */
export function rollDie(): number;
/**
 * Roll an unbiased die.
 * A biased die can be implemented using GachaMachine.
 */
export function rollDie(
  optOrExp: RollOptions | string = defaultRollOptions,
  expSeparate = false,
): number | number[] {
  if (typeof optOrExp === "undefined") {
    return getRandom(6);
  } else if (typeof optOrExp === "string") {
    const { times, face, modifier } = parseExpression(optOrExp);
    if (modifier && expSeparate) {
      throw new Error("Cannot add a modifier when rolling dice separately.");
    }
    if (times === 1) return getRandom(face);
    else {
      if (!expSeparate) {
        let res = 0;
        let i = 0;
        while (i < times) {
          res += getRandom(face);
          i += 1;
        }
        return res + modifier;
      } else {
        const res = new Array(times);
        let i = 0;
        while (i < times) {
          res[i] = getRandom(face);
          i += 1;
        }
        return res;
      }
    }
  } else if (typeof optOrExp === "object") {
    const { times, face, separate, modifier } = {
      ...defaultRollOptions,
      ...optOrExp,
    };
    if (!times) throw new Error("Invalid value for `times`.");
    if (times === 1) return getRandom(face || 6);
    else {
      if (!separate) {
        let res = 0;
        let i = 0;
        while (i < times) {
          res += getRandom(face || 6);
          i += 1;
        }
        return res + (modifier || 0);
      } else {
        if (modifier) {
          throw new Error(
            "Cannot add a modifier when rolling dice separately.",
          );
        }
        const res = new Array(times);
        let i = 0;
        while (i < times) {
          res[i] = getRandom(face || 6);
          i += 1;
        }
        return res;
      }
    }
  } else {
    throw new Error(`Paramaters are not of the required format.`);
  }
}

function getRandom(n: number) {
  return Math.floor(Math.random() * n) + 1;
}
