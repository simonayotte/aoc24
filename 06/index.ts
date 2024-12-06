const file = await Deno.readTextFile("input.txt");

const map = file
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const OBSTRUCTION = "#";
const GUARD = "^";

type Position = [number, number];
type Direction = [number, number];

const DIRECTIONS: Record<string, Direction> = {
  UP: [-1, 0],
  RIGHT: [0, 1],
  DOWN: [1, 0],
  LEFT: [0, -1],
} as const;

const getStartPosition = (): Position | undefined => {
  let startPos: Position | undefined;

  for (let row = 0; row < map.length; row++) {
    const col = map[row].indexOf(GUARD);
    if (col !== -1) {
      startPos = [row, col];
      break;
    }
  }

  return startPos;
};

const isInBounds = ([row, col]: Position): boolean =>
  row >= 0 && col >= 0 && row < map.length && col < map[0].length;

const getNextPos = (
  [row, col]: Position,
  [dRow, dCol]: Direction
): Position => [row + dRow, col + dCol];

const turnRight = (dir: Direction): Direction => {
  const sequence = [
    DIRECTIONS.UP,
    DIRECTIONS.RIGHT,
    DIRECTIONS.DOWN,
    DIRECTIONS.LEFT,
  ];
  const currentIndex = sequence.findIndex(
    (d) => d[0] === dir[0] && d[1] === dir[1]
  );
  return sequence[(currentIndex + 1) % sequence.length];
};

const posToString = ([row, col]: Position): string => `${row},${col}`;

const moveGuard = (map: string[][], startPos: Position) => {
  const seen = new Set<string>();
  let pos = startPos;
  let dir = DIRECTIONS.UP;

  seen.add(posToString(pos));

  while (true) {
    const [x, y] = getNextPos(pos, dir);

    if (!isInBounds([x, y])) {
      break;
    }

    if (map[x][y] === OBSTRUCTION) {
      dir = turnRight(dir);
    } else {
      pos = [x, y];
      seen.add(posToString(pos));
    }
  }

  return seen.size;
};

const part1 = (): number => {
  const startPos = getStartPosition();

  if (!startPos) return 0;
  return moveGuard(map, startPos);
};

console.log("Part 1: ", part1());
