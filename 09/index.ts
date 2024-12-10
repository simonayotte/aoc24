const createDiskMap = async (input: string): Promise<string[]> => {
  const file = await Deno.readTextFile(input);

  let diskMap: string[] = [];
  let id: number = 0;

  for (let i = 0; i < file.length; i++) {
    const blocks = parseInt(file[i], 10);

    const value = i % 2 === 0 ? id.toString() : ".";
    diskMap.push(...Array(blocks).fill(value));

    if (i % 2 === 0) id++;
  }

  return diskMap;
};

const diskMap = await createDiskMap("example.txt");

const getChecksum = (diskMap: string[]): number => {
  let sum = 0;
  for (const [idx, val] of diskMap.entries()) {
    if (val === ".") continue;

    sum += parseInt(val, 10) * idx;
  }

  return sum;
};

const part1 = () => {
  let i = 0;
  const rev = diskMap.filter((block) => block !== ".").toReversed();

  for (const [idx, block] of diskMap.entries()) {
    if (block !== ".") continue;

    diskMap[idx] = rev[i];
    i++;
  }

  diskMap.splice(-i);

  const sum = getChecksum(diskMap);
  console.log("Part 1: ", sum);
};

part1();
