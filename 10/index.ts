const file = await Deno.readTextFile("input.txt");
const map = file.split("\n").map((line) => line.split("").map(Number));

const rows = map.length;
const cols = map[0].length;

const MAX_HEIGHT = 9;

const getTrailheads = (): [number, number][] => {
  const trailheads: [number, number][] = [];

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (map[i][j] === 0) {
        trailheads.push([i, j]);
      }
    }
  }
  return trailheads;
};

const directions = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const key = (x: number, y: number): string => {
  return `${x},${y}`;
};

const part1 = () => {
  const trailheads = getTrailheads();

  const scoreTrailhead = (r0: number, c0: number): number => {
    const visited = new Set<string>();
    const queue: [number, number][] = [[r0, c0]];
    visited.add(key(r0, c0));
    const tops = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const h = map[r][c];

      if (h === MAX_HEIGHT) {
        tops.add(key(r, c));
        continue;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr,
          nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;

        if (map[nr][nc] === h + 1 && !visited.has(key(nr, nc))) {
          visited.add(key(nr, nc));
          queue.push([nr, nc]);
        }
      }
    }

    return tops.size;
  };

  let sum = 0;
  for (const [r, c] of trailheads) sum += scoreTrailhead(r, c);
  console.log("Part 1: ", sum);
};

const part2 = () => {
  const memo = new Map<string, number>();

  const rateTrailhead = (r: number, c: number): number => {
    const k = key(r, c);
    if (memo.has(k)) return memo.get(k)!;

    const h = map[r][c];

    if (h === MAX_HEIGHT) {
      memo.set(k, 1);
      return 1;
    }

    let total = 0;
    for (const [dr, dc] of directions) {
      const nr = r + dr,
        nc = c + dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
      if (map[nr][nc] === h + 1) total += rateTrailhead(nr, nc);
    }

    memo.set(k, total);
    return total;
  };

  const trailheads = getTrailheads();

  let sum = 0;
  for (const [r, c] of trailheads) sum += rateTrailhead(r, c);
  console.log("Part 2: ", sum);
};

part1();
part2();
