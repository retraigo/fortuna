// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function roll(choices, totalChance = 0) {
    let total = totalChance;
    let i = 0;
    if (totalChance === 0) {
        while(i < choices.length){
            total += choices[i].chance;
            i += 1;
        }
    }
    const result = Math.random() * total;
    let going = 0.0;
    i = 0;
    while(i < choices.length){
        going += choices[i].chance;
        if (result < going) {
            return choices[i].result;
        }
        i += 1;
    }
    return choices[Math.floor(Math.random() * choices.length)].result;
}
export { roll as roll };
