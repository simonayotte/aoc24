const file = await Deno.readTextFile("input.txt");

const letters = file
  .trim()
  .split("\n")
  .map((row) => row.split(""));

type Direction = -1 | 0 | 1;

const getMatchCountForDirections = (
  letters: string[][],
  row: number,
  col: number,
  pattern: string
): number => {
  const chars = pattern.trim().split("");
  const directions: [Direction, Direction][] = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  return directions.reduce(
    (count, [dx, dy]) =>
      count + (isMatchForDirection(letters, row, col, chars, dx, dy) ? 1 : 0),
    0
  );
};

const isMatchForDirection = (
  letters: string[][],
  i: number,
  j: number,
  chars: string[],
  dx: Direction,
  dy: Direction
): boolean => {
  for (const c of chars) {
    if (i < 0 || j < 0 || i >= letters.length || j >= letters[0].length) {
      return false;
    }

    if (c !== letters[i][j]) {
      return false;
    }

    i += dx;
    j += dy;
  }

  return true;
};

const sumOccurencesPattern = (letters: string[][], pattern: string): number => {
  let sum = 0;
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
      sum += getMatchCountForDirections(letters, i, j, pattern);
    }
  }
  return sum;
};

console.log("Part 1: ", sumOccurencesPattern(letters, "XMAS"));

const sumOccurencesXMASCrossPattern = (letters: string[][]): number => {
  let sum = 0;
  for (let i = 0; i < letters.length; i++) {
    for (let j = 0; j < letters[i].length; j++) {
      sum += isXMASCrossPattern(letters, i, j) ? 1 : 0;
    }
  }
  return sum;
};

const isXMASCrossPattern = (
  letters: string[][],
  i: number,
  j: number
): boolean => {
  if (i < 0 || j < 0 || i >= letters.length || j >= letters[0].length) {
    return false;
  }

  if (letters[i][j] !== "A") {
    return false;
  }

  const directions: [Direction, Direction][] = [
    [-1, -1],
    [1, 1],
    [-1, 1],
    [1, -1],
  ];

  for (const [x, y] of directions) {
    if (
      i + x < 0 ||
      j + y < 0 ||
      i + x >= letters.length ||
      j + y >= letters[0].length
    ) {
      return false;
    }
  }

  const isFirstDiagonalValid =
    (letters[i + directions[0][0]][j + directions[0][1]] == "M" &&
      letters[i + directions[1][0]][j + directions[1][1]] == "S") ||
    (letters[i + directions[0][0]][j + directions[0][1]] == "S" &&
      letters[i + directions[1][0]][j + directions[1][1]] == "M");
  const isSeconDiagonalValid =
    (letters[i + directions[2][0]][j + directions[2][1]] == "M" &&
      letters[i + directions[3][0]][j + directions[3][1]] == "S") ||
    (letters[i + directions[2][0]][j + directions[2][1]] == "S" &&
      letters[i + directions[3][0]][j + directions[3][1]] == "M");

  return isFirstDiagonalValid && isSeconDiagonalValid;
};

console.log("Part 2: ", sumOccurencesXMASCrossPattern(letters));
