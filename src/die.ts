export interface DieConfig {
  times: number;
  face: number;
}

function parseExpression(exp: string): DieConfig {
  const matches = /^\s*(\d*)\s*d\s*(\d+)\s*$/.exec(exp);
  if (!matches) {
    throw new Error(
      `Die Expression ${exp} is not of the format <count>d<faces> (eg. 2d10)`,
    );
  }
  const times = Number(matches[1]);
  const face = Number(matches[2]);
  if (isNaN(face)) {
    throw new Error(
      `Die Expression ${exp} is not of the format <count>d<faces> (eg. 2d10)`,
    );
  } else if (isNaN(times)) {
    return { times: 1, face };
  } else return { times, face };
}

export interface RollOptions {
  times?: number;
  face?: number;
  separate?: boolean;
}
const defaultRollOptions: RollOptions = { times: 1, face: 6, separate: false };

export function rollDie(exp: string, separate?: boolean): number | number[];
export function rollDie(options: RollOptions): number | number[];
export function rollDie(): number;
export function rollDie(
  optOrExp?: RollOptions | string,
  expSeparate = false,
): number | number[] {
  if (typeof optOrExp === "undefined") {
    return getRandom(6);
  } else if (typeof optOrExp === "string") {
    const { times, face } = parseExpression(optOrExp);
    if (times === 1) return getRandom(face);
    else {
      if (!expSeparate) {
        let res = 0;
        let i = 0;
        while (i < times) {
          res += getRandom(face);
          i += 1;
        }
        return res;
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
    const { times, face, separate } = { ...defaultRollOptions, ...optOrExp };
    console.log(times);
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
        return res;
      } else {
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
