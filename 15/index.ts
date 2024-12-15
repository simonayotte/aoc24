const file = await Deno.readTextFile("input.txt");

let map = file
  .split("\n\n")[0]
  .split("\n")
  .map((line) => line.split(""));

const moves = file.split("\n\n")[1].replaceAll("\n", "").split("");

const robotInitPosition: [number, number] = map.reduce(
  (acc, row, rowIndex) => {
    const colIndex = row.indexOf("@");
    return colIndex !== -1 ? [rowIndex, colIndex] : acc;
  },
  [-1, -1]
);

type Direction = [number, number];
const moveDirections: Record<string, Direction> = {
  ">": [0, 1],
  "<": [0, -1],
  "^": [-1, 0],
  v: [1, 0],
};

const updateRobotPosition = (
  robotPos: [number, number],
  dir: [number, number]
): [number, number] => {
  const [x, y] = robotPos;
  const [dx, dy] = dir;

  map[x][y] = ".";
  map[x + dx][y + dy] = "@";
  robotPos = [x + dx, y + dy];

  return robotPos;
};

const moveRobot = (
  robotPos: [number, number],
  dir: [number, number]
): [number, number] => {
  const [x, y] = robotPos;
  const [dx, dy] = dir;

  const nextCell = map[x + dx][y + dy];

  if (nextCell === ".") {
    robotPos = updateRobotPosition(robotPos, dir);
  } else if (nextCell === "O") {
    let nx = x + dx + dx;
    let ny = y + dy + dy;

    let cellBehind = map[nx][ny];

    while (cellBehind === "O") {
      nx += dx;
      ny += dy;
      cellBehind = map[nx][ny];
    }

    if (cellBehind === ".") {
      map[nx][ny] = "O";
      robotPos = updateRobotPosition(robotPos, dir);
    }
  }

  return robotPos;
};

const sumGPSCoordinates = (): number => {
  return map
    .flatMap((row, y) => row.map((cell, x) => (cell === "O" ? x + 100 * y : 0)))
    .reduce((acc, value) => acc + value, 0);
};

const part1 = () => {
  let robotPos = robotInitPosition;

  moves.forEach((move) => {
    const dir = moveDirections[move];
    robotPos = moveRobot(robotPos, dir);
  });

  const sum = sumGPSCoordinates();

  console.log("Part 1: ", sum);
};

part1();
