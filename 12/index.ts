const file = await Deno.readTextFile("input.txt");
const map = file
  .trim()
  .split("\n")
  .map((line) => line.split(""));

const rows = map.length;
const cols = map[0].length;

const isInBounds = ([x, y]: [number, number]): boolean => {
  return x >= 0 && y >= 0 && x < rows && y < cols;
};

const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

interface Region {
  Type: string;
  Points: Array<[number, number]>;
}

const buildRegions = (map: string[][]): Region[] => {
  const regions = new Array<Region>();
  const visited = new Set<string>();
  const nodesToVisit = new Array<[number, number]>();

  const buildRegion = ([x, y]: [number, number]): Region => {
    const region = {
      Type: map[x][y],
      Points: new Array<[number, number]>(),
    };

    const nodesToVisitInRegion = new Array<[number, number]>([x, y]);
    while (nodesToVisitInRegion.length !== 0) {
      const [x, y] = nodesToVisitInRegion.pop()!;
      if (visited.has(`${x},${y}`)) continue;
      if (region.Type === map[x][y]) region.Points.push([x, y]);
      visited.add(`${x},${y}`);

      for (const [dx, dy] of directions) {
        if (!isInBounds([x + dx, y + dy])) continue;
        if (visited.has(`${x + dx},${y + dy}`)) continue;

        const type = map[x + dx][y + dy];
        if (type === region.Type) {
          nodesToVisitInRegion.push([x + dx, y + dy]);
        } else {
          nodesToVisit.push([x + dx, y + dy]);
        }
      }
    }
    return region;
  };

  nodesToVisit.push([0, 0]);
  while (nodesToVisit.length !== 0) {
    const [x, y] = nodesToVisit.pop()!;
    if (!visited.has(`${x},${y}`)) {
      regions.push(buildRegion([x, y]));
    }
  }

  return regions;
};

const getRegionPerimeter = (region: Region): number => {
  let perimeter = 0;
  const points = region.Points;

  const pointSet = new Set(points.map(([x, y]) => `${x},${y}`));

  for (const [x, y] of points) {
    for (const [dx, dy] of directions) {
      if (!pointSet.has(`${x + dx},${y + dy}`)) {
        perimeter++;
      }
    }
  }

  return perimeter;
};

const getRegionArea = (region: Region): number => {
  return region.Points.length;
};

const getFencePrice = (r: Region): number => {
  return getRegionArea(r) * getRegionPerimeter(r);
};

const part1 = () => {
  const regions = buildRegions(map);

  const totalPrice = regions.reduce(
    (total, fence) => (total += getFencePrice(fence)),
    0
  );

  console.log("Part 1: ", totalPrice);
};

part1();
