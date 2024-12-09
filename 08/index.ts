interface Point {
  x: number;
  y: number;
}

const file = await Deno.readTextFile("input.txt");

const input = file
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const HEIGHT = input.length;
const LENGTH = input[0].length;

const map = new Map<string, Point[]>();

for (let row = 0; row < HEIGHT; row++) {
  for (let col = 0; col < LENGTH; col++) {
    const cell = input[row][col];
    if (cell !== ".") {
      const point: Point = { x: row, y: col };
      map.set(cell, [...(map.get(cell) || []), point]);
    }
  }
}

const isInBounds = (point: Point): boolean => {
  return point.x >= 0 && point.x < HEIGHT && point.y >= 0 && point.y < LENGTH;
};

const getDistanceVector = (p1: Point, p2: Point): Point => {
  return { x: p2.x - p1.x, y: p2.y - p1.y };
};

const part1 = () => {
  const antinodes = new Set<string>();

  for (const key of map.keys()) {
    const points = map.get(key)!;

    for (const p1 of points) {
      for (const p2 of points) {
        if (p1.x === p2.x && p1.y === p2.y) continue;

        const c1 = { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y };
        const c2 = { x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y };

        if (isInBounds(c1)) antinodes.add(`${c1.x},${c1.y}`);
        if (isInBounds(c2)) antinodes.add(`${c2.x},${c2.y}`);
      }
    }
  }

  console.log("Part 1: ", antinodes.size);
};

const part2 = () => {
  const antinodes = new Set<string>();

  for (const key of map.keys()) {
    const points = map.get(key)!;

    for (const p1 of points) {
      for (const p2 of points) {
        if (p1.x === p2.x && p1.y === p2.y) continue;

        const dist = getDistanceVector(p1, p2);
        let p = { ...p1 };
        let firstIteration = true;

        do {
          const next: Point = {
            x: p.x + dist.x,
            y: p.y + dist.y,
          };

          if (isInBounds(next)) antinodes.add(`${next.x},${next.y}`);

          p = next;
          firstIteration = false;

          if (
            !isInBounds(p) ||
            (p.x === p1.x && p.y === p1.y && !firstIteration)
          ) {
            break;
          }
        } while (true);
      }
    }
  }

  console.log("Part 2: ", antinodes.size);
};

part1();
part2();
