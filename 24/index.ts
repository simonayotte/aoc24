const file = await Deno.readTextFile("input.txt");
const map = new Map<string, number>();

file
  .split("\n\n")[0]
  .split("\n")
  .forEach((line) => {
    const [k, v] = line.split(": ");
    map.set(k, parseInt(v, 10));
  });

const rules = file.split("\n\n")[1].split("\n");

type BinaryOperation = "AND" | "XOR" | "OR";

interface LogicalExpression {
  left: string;
  right: string;
  op: BinaryOperation;
  output: string;
}

const parseLogicalExpression = (exp: string): LogicalExpression => {
  const [operationPart, output] = exp.split("->").map((part) => part.trim());

  const parts = operationPart.split(/\s+/);
  const [left, op, right] = parts;

  return {
    left,
    right,
    op: op as BinaryOperation,
    output,
  };
};

const evaluateBinaryExpression = (
  exp: LogicalExpression
): number | undefined => {
  const left = map.get(exp.left);
  const right = map.get(exp.right);

  if (left === undefined || right === undefined) return undefined;

  const op = exp.op;

  if (op === "AND") return left & right;
  else if (op === "OR") return left | right;
  else if (op === "XOR") return left ^ right;

  return undefined;
};

const findAndSortZKeys = (): string[] => {
  return Array.from(map.keys())
    .filter((key) => key.startsWith("z"))
    .sort((a, b) => b.localeCompare(a));
};

const part1 = () => {
  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      const exp = parseLogicalExpression(rule);
      if (!map.has(exp.output)) {
        const res = evaluateBinaryExpression(exp);
        if (res !== undefined) {
          map.set(exp.output, res);
          changed = true;
        }
      }
    }
  }

  const keys = findAndSortZKeys();

  let res = "";
  keys.forEach((key) => {
    const v = map.get(key)!;
    res += v.toString();
  });

  console.log("Part 1: ", parseInt(res, 2));
};

part1();
