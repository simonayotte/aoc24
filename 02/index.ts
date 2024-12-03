const file = await Deno.readTextFile("input.txt");
const reports = file
  .trim()
  .split("\n")
  .map((levels) =>
    levels
      .trim()
      .split(" ")
      .map((level) => parseInt(level, 10))
  );

const isReportSafe = (levels: number[]) => {
  if (levels.length <= 1) return true;

  const order = levels[1] - levels[0];

  const isAdjacentLevelValid = (diff: number) =>
    Math.abs(diff) >= 1 && Math.abs(diff) <= 3;

  if (!isAdjacentLevelValid(order)) return false;

  for (let i = 1; i < levels.length - 1; i++) {
    const diff = levels[i + 1] - levels[i];

    if (!isAdjacentLevelValid(diff)) return false;
    if (Math.sign(diff) !== Math.sign(order)) return false;
  }

  return true;
};

const sumSafeReports = (arr: number[][]): number => {
  return arr.filter((report) => isReportSafe(report)).length;
};

const sumCanReportsBeSafe = (arr: number[][]): number => {
  return arr.filter((report) => canReportBeSafe(report)).length;
};

const canReportBeSafe = (levels: number[]) => {
  if (isReportSafe(levels)) return true;

  for (let i = 0; i < levels.length; i++) {
    const newLevels = levels.filter((_, index) => i !== index);
    if (isReportSafe(newLevels)) return true;
  }

  return false;
};

console.log("Part 1:", sumSafeReports(reports));
console.log("Part 2:", sumCanReportsBeSafe(reports));
