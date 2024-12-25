const file = await Deno.readTextFile("input.txt");
const inputs = file.split("\n\n").map((line) => line.split("\n"));

const keys: number[][] = [];
const locks: number[][] = [];

const isKey = (input: string[]): boolean => {
  return input[0] === "....." && input[input.length - 1] === "#####";
};

const getHeight = (row: string, index: number): number => {
  return row[index] === "#" ? 1 : 0;
};

const processInput = (input: string[], collection: number[][]) => {
  let heights: number[] = [0, 0, 0, 0, 0];
  for (let i = 1; i < input.length - 1; i++) {
    for (let j = 0; j < 5; j++) {
      heights[j] += getHeight(input[i], j);
    }
  }
  collection.push(heights);
};

const isValidCombination = (key: number[], lock: number[]): boolean => {
  for (let i = 0; i < lock.length; i++) {
    if (key[i] + lock[i] > 5) return false;
  }

  return true;
};

inputs.forEach((input) => {
  if (isKey(input)) {
    processInput(input, keys);
  } else {
    processInput(input, locks);
  }
});

const part1 = () => {
  const set = new Set<string>();

  const getKey = (keyId: number, lockId: number): string =>
    `${keyId},${lockId}`;

  for (let i = 0; i < locks.length; i++) {
    for (let j = 0; j < keys.length; j++) {
      if (isValidCombination(keys[j], locks[i])) set.add(getKey(j, i));
    }
  }

  console.log("Part 1: ", set.size);
};

part1();
