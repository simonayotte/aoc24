const file = await Deno.readTextFile("input.txt");
const bytes = file.split("\n").map((line) => line.split(",").map(Number));

type Position = [number, number];
const start: Position = [0, 0];

const directions: Position[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const getMemorySpace = (maxIndex: number, bytesCount: number): string[][] => {
  const memorySpaceSize = maxIndex + 1;

  const memorySpace: string[][] = Array.from({ length: memorySpaceSize }, () =>
    new Array(memorySpaceSize).fill(".")
  );

  for (let i = 0; i < bytesCount; i++) {
    const [x, y] = bytes[i];
    memorySpace[y][x] = "#";
  }

  return memorySpace;
};

const findShortestPathLength = (mem: string[][], end: Position): number => {
  const [ex, ey] = end;

  const rows = mem.length;
  const cols = mem[0].length;

  const visited = new Set<string>();
  const key = ([x, y]: Position): string => `${x},${y}`;

  const isValid = ([x, y]: Position): boolean => {
    return (
      x >= 0 &&
      x < rows &&
      y >= 0 &&
      y < cols &&
      mem[y][x] === "." &&
      !visited.has(key([x, y]))
    );
  };

  const queue: [Position, number][] = [[start, 0]];
  visited.add(key(start));

  while (queue.length > 0) {
    const [currentPos, distance] = queue.shift()!;
    const [x, y] = currentPos;

    if (x === ex && y === ey) {
      return distance;
    }

    for (const [dx, dy] of directions) {
      const nextPos: Position = [x + dx, y + dy];
      if (isValid(nextPos)) {
        visited.add(key(nextPos));
        queue.push([nextPos, distance + 1]);
      }
    }
  }

  return -1;
};

const part1 = () => {
  const memorySpaceMaxIndex = 70;
  const bytesCount = 1024;

  const end: Position = [memorySpaceMaxIndex, memorySpaceMaxIndex];
  const mem = getMemorySpace(memorySpaceMaxIndex, bytesCount);

  const shortestPathLength = findShortestPathLength(mem, end);

  console.log("Part 1: ", shortestPathLength);
};

part1();

const part2 = () => {
  const memorySpaceMaxIndex = 70;
  const bytesCount = bytes.length;

  const end: Position = [memorySpaceMaxIndex, memorySpaceMaxIndex];

  for (let i = 1; i < bytesCount; i++) {
    const byte = bytes[i];
    const mem = getMemorySpace(memorySpaceMaxIndex, i + 1);

    if (findShortestPathLength(mem, end) === -1) {
      console.log("Part 2: ", byte);
      break;
    }
  }
};

part2();
