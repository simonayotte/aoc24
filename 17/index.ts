const file = await Deno.readTextFile("input.txt");

const input = file.split("\n\n");

let a = parseInt(input[0].match(/Register A: (\d+)/)?.[1] || "0");
let b = parseInt(input[0].match(/Register B: (\d+)/)?.[1] || "0");
let c = parseInt(input[0].match(/Register C: (\d+)/)?.[1] || "0");

const program = input[1].slice("Program: ".length).split(",").map(Number);

let ptr = 0;
let inc: boolean;

const getComboOperand = (n: number): number => {
  switch (n) {
    case 0:
    case 1:
    case 2:
    case 3:
      return n;
    case 4:
      return a;
    case 5:
      return b;
    case 6:
      return c;
    default:
      console.error("Parsed an invalid operand");
      return 0;
  }
};

const exec = (opCode: number, literalOp: number): number[] => {
  const op = getComboOperand(literalOp);
  switch (opCode) {
    case 0:
      adv(op);
      return [];
    case 1:
      bxl(literalOp);
      return [];
    case 2:
      bst(op);
      return [];
    case 3:
      jnz(literalOp);
      return [];
    case 4:
      bxc(op);
      return [];
    case 5:
      return out(op);
    case 6:
      bdv(op);
      return [];
    case 7:
      cdv(op);
      return [];
    default:
      console.error("Parsed an invalid operator");
      return [];
  }
};

// Division operators
const adv = (op: number): void => {
  a = Math.trunc(a / 2 ** op);
};

const bdv = (op: number): void => {
  b = Math.trunc(a / 2 ** op);
};

const cdv = (op: number): void => {
  c = Math.trunc(a / 2 ** op);
};

// Other operators
const bxl = (op: number): void => {
  b ^= op;
};

const bst = (op: number): void => {
  b = op % 8;
};

const jnz = (op: number): void => {
  if (a === 0) return;
  ptr = op;
  inc = false;
};

const bxc = (op: number): void => {
  b ^= c;
};

// Output operator
const out = (op: number): number[] => {
  return [op % 8];
};

const part1 = () => {
  let output: number[] = [];

  while (ptr < program.length) {
    inc = true;
    const operator = program[ptr];

    if (ptr + 1 >= program.length) break;
    const operand = program[ptr + 1];

    let res = exec(operator, operand);
    output = [...output, ...res];

    if (inc) ptr += 2;
  }

  console.log("Part 1: ", output.join(","));
};

part1();
