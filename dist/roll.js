// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function roll(choices, chanceArrOrTotalChance = 0, totalChance = 0) {
    const asArray = Array.isArray(chanceArrOrTotalChance);
    let total = asArray ? totalChance : chanceArrOrTotalChance || 0;
    if (typeof total !== "number") {
        throw new TypeError(`Invalid type for total chance. Expected 'undefined' or 'number', got '${typeof total}'`);
    }
    let i = 0;
    if (total === 0) {
        while(i < choices.length){
            total += asArray ? chanceArrOrTotalChance[i] : choices[i].chance;
            i += 1;
        }
    }
    const result = Math.random() * total;
    let going = 0.0;
    i = 0;
    while(i < choices.length){
        going += asArray ? chanceArrOrTotalChance[i] : choices[i].chance;
        if (result < going) {
            return asArray ? choices[i] : choices[i].result;
        }
        i += 1;
    }
    return asArray ? choices[Math.floor(Math.random() * choices.length)] : choices[Math.floor(Math.random() * choices.length)].result;
}
export { roll as roll };
