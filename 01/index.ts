const file = await Deno.readTextFile("input.txt");

const lines = file
  .trim()
  .split("\n")
  .map((line) => line.split(/\s+/));

const arr1: number[] = lines.map(([left, _]) => parseInt(left, 10)).sort();
const arr2: number[] = lines.map(([_, right]) => parseInt(right, 10)).sort();

const sumDifferences = (arr1: number[], arr2: number[]) => {
  return arr1.reduce(
    (sum, _val, index) => sum + Math.abs(arr1[index] - arr2[index]),
    0
  );
};

const sumOccurences = (arr1: number[], arr2: number[]) => {
  const occs = arr1.map(
    (leftVal) =>
      leftVal * arr2.filter((rightVal) => leftVal === rightVal).length
  );

  return occs.reduce((sum, val) => sum + val, 0);
};

console.log("Part 1:", sumDifferences(arr1, arr2));
console.log("Part 2:", sumOccurences(arr1, arr2));
