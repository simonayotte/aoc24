const file = await Deno.readTextFile("input.txt");
const regex = /p=(-?\d+),(-?\d+)\s*v=(-?\d+),(-?\d+)/;

interface Robot {
  p: [number, number];
  v: [number, number];
}

const input = file
  .trim()
  .split("\n")
  .map((line) => {
    let matches = line.match(regex);

    const px = parseInt(matches![1]);
    const py = parseInt(matches![2]);

    const vx = parseInt(matches![3]);
    const vy = parseInt(matches![4]);

    return {
      p: [px, py],
      v: [vx, vy],
    } as Robot;
  });

const ROWS = 103;
const COLS = 101;

const TICK_COUNT = 100;

interface Quadrant {
  x: [number, number];
  y: [number, number];
}

const quadrants: Record<number, Quadrant> = {
  0: { x: [0, COLS / 2], y: [0, ROWS / 2] },
  1: { x: [COLS / 2, COLS], y: [0, ROWS / 2] },
  2: { x: [0, COLS / 2], y: [ROWS / 2, ROWS] },
  3: { x: [COLS / 2, COLS], y: [ROWS / 2, ROWS] },
};

const tick = (robot: Robot): Robot => {
  const { v, p } = robot;

  const [px, py] = p;
  const [vx, vy] = v;

  const newX = (px + vx + COLS) % COLS;
  const newY = (py + vy + ROWS) % ROWS;

  return {
    p: [newX, newY],
    v: [vx, vy],
  } as Robot;
};

const isNotOnMiddleLine = (robot: Robot): boolean => {
  const [px, py] = robot.p;

  const midX = Math.floor(COLS / 2);
  const midY = Math.floor(ROWS / 2);

  return !(px === midX || py === midY) && !(px === midX) && !(py === midY);
};

const isInQuadrant = (quadrant: Quadrant, robot: Robot): boolean => {
  const [px, py] = robot.p;

  const [x1, x2] = quadrant.x;
  const [y1, y2] = quadrant.y;

  return x1 <= px && px <= x2 && y1 <= py && py <= y2;
};

const getSafetyFactor = (robots: Robot[]) => {
  const results = [0, 0, 0, 0];
  for (const id in quadrants) {
    for (const robot of robots) {
      if (isInQuadrant(quadrants[id], robot) && isNotOnMiddleLine(robot))
        results[id]++;
    }
  }

  return results.reduce((acc, val) => acc * val, 1);
};

const part1 = () => {
  let robots = input;
  for (let i = 0; i < TICK_COUNT; i++)
    robots = robots.map((robot) => tick(robot));

  const safetyFactor = getSafetyFactor(robots);

  console.log("Part 1: ", safetyFactor);
};

part1();
