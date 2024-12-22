const file = await Deno.readTextFile("input.txt");
const input = file.split("\n").map(Number);

const getNextSecretNumber = (n: number): number => {
  n = mix(n << 6, n);
  n = prune(n);

  n = mix(Math.floor(n >> 5), n);
  n = prune(n);

  n = mix(n << 11, n);
  return prune(n);
};

const prune = (sn: number): number => {
  return sn % 16777216;
};

const mix = (n: number, sn: number): number => {
  return (n ^ sn) >>> 0;
};

const part1 = () => {
  const res = input;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < 2000; j++) {
      const val = res[i];
      res[i] = getNextSecretNumber(val);
    }
  }

  const sum = res.reduce((acc, val) => val + acc, 0);

  console.log("Part 1: ", sum);
};

part1();
