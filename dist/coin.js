// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function unbiasedCoin(n = 1) {
    const upperBound = 1 << n;
    const res = Math.floor(Math.random() * upperBound).toString(2).padStart(n, "0");
    return res.split("").map((x)=>x === "0" ? "H" : "T");
}
export { unbiasedCoin as unbiasedCoin };
