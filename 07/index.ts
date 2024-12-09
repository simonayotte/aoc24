const file = await Deno.readTextFile("input.txt");

const input = file
  .trim()
  .split("\n")
  .map((line) => line.split(":"));

const results = input.map(([input]) => input).map(Number);
const operands = input.map(([_, operands]) =>
  operands.trimStart().split(" ").map(Number)
);

const evaluateEquation = (operands: number[], operators: string[]): number => {
  let res = operands[0];
  for (let i = 0; i < operands.length; i++) {
    if (operators[i] === "+") {
      res += operands[i + 1];
    } else if (operators[i] === "*") {
      res *= operands[i + 1];
    } else if (operators[i] === "||") {
      res = parseInt(res.toString() + operands[i + 1], 10);
    }
  }
  return res;
};

// Returns if the equation could be valid for a combination of the given operators
const findValidOperators = (
  result: number,
  operands: number[],
  possibleOperators: string[]
): boolean => {
  const operatorsCount = operands.length - 1;
  const possibleOperatorsCount = possibleOperators.length;

  for (let i = 0; i < Math.pow(possibleOperatorsCount, operatorsCount); i++) {
    const operators: string[] = [];
    let n = i;

    for (let j = 0; j < operatorsCount; j++) {
      operators.push(possibleOperators[n % possibleOperatorsCount]);
      n = Math.floor(n / possibleOperatorsCount);
    }
    if (evaluateEquation(operands, operators) === result) return true;
  }

  return false;
};

const part1 = () => {
  const operators = ["+", "*"];

  const validEquations = results.filter((res, idx) =>
    findValidOperators(res, operands[idx], operators)
  );

  const sum = validEquations.reduce((sum, res) => sum + res, 0);
  console.log("Part 1: ", sum);
};

const part2 = () => {
  const operators = ["+", "*", "||"];

  const validEquations = results.filter((res, idx) =>
    findValidOperators(res, operands[idx], operators)
  );

  const sum = validEquations.reduce((sum, res) => sum + res, 0);
  console.log("Part 2: ", sum);
};

part1();
part2();
