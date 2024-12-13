const file = await Deno.readTextFile("input.txt");

const COST_A = 3;
const COST_B = 1;

const parseCoordinates = (line: string): [number, number] => {
  const regex = /X([+=|-]?)(\d+),\s*Y([+=|-]?)(\d+)/;
  const match = line.match(regex);

  if (!match) return [0, 0];

  const x = match[1] === "-" ? -parseInt(match[2]) : +parseInt(match[2]);
  const y = match[3] === "-" ? -parseInt(match[4]) : +parseInt(match[4]);

  return [x, y];
};

interface Machine {
  A: [number, number];
  B: [number, number];
  Prize: [number, number];
}

const machines = file
  .trim()
  .split("\n\n")
  .map((block) => {
    const machine: Machine = {
      A: parseCoordinates(block.split("\n")[0]),
      B: parseCoordinates(block.split("\n")[1]),
      Prize: parseCoordinates(block.split("\n")[2]),
    };
    return machine;
  });

const findCheapestTokens = (
  machine: Machine,
  priceIncrease: number = 0
): [number, number] => {
  const { A, B, Prize } = machine;

  const det = A[0] * B[1] - A[1] * B[0];
  if (det === 0) return [0, 0];

  const px = Prize[0] + priceIncrease;
  const py = Prize[1] + priceIncrease;

  const a = (px * B[1] - py * B[0]) / det;
  const b = (px * A[1] - py * A[0]) / -det;

  if (a < 0 || b < 0 || !Number.isInteger(a) || !Number.isInteger(b))
    return [0, 0];

  return [a, b];
};

const part1 = () => {
  const totalTokenCost = machines.reduce((total, machine) => {
    const [a, b] = findCheapestTokens(machine);
    return total + a * COST_A + b * COST_B;
  }, 0);

  console.log("Part 1: ", totalTokenCost);
};

const part2 = () => {
  const PRICE_INCREASE = 10000000000000;

  const totalTokenCost = machines.reduce((total, machine) => {
    const [a, b] = findCheapestTokens(machine, PRICE_INCREASE);
    return total + a * COST_A + b * COST_B;
  }, 0);

  console.log("Part 2: ", totalTokenCost);
};

part1();
part2();
