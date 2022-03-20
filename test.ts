import {GachaMachine} from "./mod.ts"

const getRandom = (arr:Array<any>) => arr[Math.floor(Math.random() * arr.length)]

const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  
  // Generate alphanumeric string
  
  function genString (lenn : number) {
    if(!lenn) lenn = 4 + Math.floor(Math.random() * 5)
  
    let phrase =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 10)
        : Math.random() > 0.5
        ? getRandom(alphabet)
        : getRandom(alphabet).toLowerCase();
  
    //  maxlim = Math.ceil(Math.random() * limit);
    for (let mmm = 0; mmm < lenn - 1; ++mmm) {
      const chances = Math.random();
      if (chances < 0.3) phrase += getRandom(alphabet);
      else if (chances > 0.3 && chances < 0.7)
        phrase += getRandom(alphabet).toLowerCase();
      else phrase += Math.floor(Math.random() * 10).toString();
    }
  
    return phrase;
  };

const items = [];
for(let i = 0; i < 100; ++i) {
    items.push({chance: Math.random() < 0.5 ? 1 : 2, result: genString(7), tier: 1, featured: false})
}

const machine = new GachaMachine(items, [1])

console.log(machine.get(33))

