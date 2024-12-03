const file = await Deno.readTextFile("input.txt");
const mulRegex = /mul\(\d{1,3},\d{1,3}\)/g;

const parseMulExpressionResult = (exp: string): number => {
  const mulExp = exp.trim().replace("mul(", "").replace(")", "").split(",");
  return parseInt(mulExp[0], 10) * parseInt(mulExp[1], 10);
};

const sumMultiplications = (matches: RegExpMatchArray | null): number => {
  if (matches === null) return 0;

  return matches.reduce((acc, curr) => acc + parseMulExpressionResult(curr), 0);
};

console.log("Part 1: ", sumMultiplications(file.match(mulRegex)));

const instructionRegex = /do\(\)|don't\(\)|mul\((\d+),(\d+)\)/g;

const sumMultiplicationsWithDisabling = (
  matches: IterableIterator<RegExpMatchArray>
): number => {
  let enabled = true;
  let sum = 0;

  for (const match of matches) {
    const instruction = match[0];
    if (instruction === "don't()") {
      enabled = false;
    } else if (instruction === "do()") {
      enabled = true;
    } else if (enabled && match[1] && match[2]) {
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);
      sum += x * y;
    }
  }

  return sum;
};

console.log(
  "Part 2: ",
  sumMultiplicationsWithDisabling(file.matchAll(instructionRegex))
);
