const file = await Deno.readTextFile("input.txt");

const map = file.split("\n").map((line) => line.split(""));

const rows = map.length;
const cols = map[0].length;

let start: [number, number];
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const cell = map[i][j];
    if (cell === "S") {
      start = [i, j];
    }
  }
}

const memo = new Map<string, number>();

const Directions: Record<string, [number, number]> = {
  UP: [-1, 0],
  DOWN: [1, 0],
  LEFT: [0, -1],
  RIGHT: [0, 1],
};

const rotate = (
  dir: [number, number],
  clockwise: boolean
): [number, number] => {
  const [dx, dy] = dir;

  return clockwise ? [-dy, dx] : [dy, -dx];
};

const solve = (pos: [number, number], dir: [number, number]): number => {
  const [x, y] = pos;
  const [dx, dy] = dir;

  if (x < 0 || x >= rows || y < 0 || y >= cols) return Infinity;
  if (map[x][y] === "#") return Infinity;

  if (map[x][y] === "E") return 0;

  const key = `${x},${y},${dx},${dy}`;
  if (memo.has(key)) return memo.get(key)!;

  // Mark as visiting to prevent infinite loops for cycle
  memo.set(key, Infinity);

  const clockwiseDir = rotate(dir, true);
  const counterClockwiseDir = rotate(dir, false);

  /*

  3 choices
  
  1. Move in the current direction
  2. Rotate clockwise
  3. Rotate counterclockwise

  */

  const res = Math.min(
    solve([x + dx, y + dy], dir) + 1,
    solve(pos, clockwiseDir) + 1000,
    solve(pos, counterClockwiseDir) + 1000
  );

  memo.set(key, res);

  return res;
};

const part1 = () => {
  const dir = Directions.RIGHT;

  const sum = solve(start, dir);
  console.log("Part 1: ", sum);
};

part1();
