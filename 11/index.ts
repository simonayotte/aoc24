const file = await Deno.readTextFile("input.txt");

const startingStones: Record<number, number> = {};
file
  .trim()
  .split(" ")
  .forEach((stone) => {
    const num = Number(stone);
    startingStones[num] = 1;
  });

const getDigitCount = (n: number): number => {
  return Math.floor(Math.log10(Math.abs(n))) + 1;
};

const splitNumber = (n: number): [number, number] => {
  const digitCount = getDigitCount(n);
  const divisor = Math.pow(10, Math.floor(digitCount / 2));
  return [Math.floor(n / divisor), n % divisor];
};

const blink = (stones: Record<number, number>): Record<number, number> => {
  const nextStones: Record<number, number> = {};
  Object.entries(stones).forEach(([stone, count]) => {
    transformStone(+stone).forEach((newStone) => {
      nextStones[newStone] = (nextStones[newStone] || 0) + count;
    });
  });

  return nextStones;
};

const transformStone = (stone: number): number[] => {
  if (stone === 0) return [1];
  if (getDigitCount(stone) % 2 === 0) return splitNumber(stone);
  return [stone * 2024];
};

const sumStones = (stones: Record<number, number>): number => {
  return Object.values(stones).reduce((sum, count) => sum + count, 0);
};

const sumStonesAfterBlinks = (blinkCount: number): number => {
  let stones = { ...startingStones };
  for (let i = 0; i < blinkCount; i++) {
    stones = blink(stones);
  }
  return sumStones(stones);
};

const part1 = () => {
  console.log("Part 1: ", sumStonesAfterBlinks(25));
};

const part2 = () => {
  console.log("Part 2: ", sumStonesAfterBlinks(75));
};

part1();
part2();
