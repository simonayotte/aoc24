const parseInputFile = async (filepath: string) => {
  const file = await Deno.readTextFile(filepath);
  const [rulesSection, updatesSection] = file.trim().split(/\n\s*\n/);

  const parseSection = (section: string) =>
    section.split("\n").map((line) => line.split(/[,|]/).map(Number));

  const rules = parseSection(rulesSection);
  const updates = parseSection(updatesSection);

  return { rules, updates };
};

const { rules, updates } = await parseInputFile("input.txt");

const isValidUpdate = (rules: number[][], update: number[]): boolean => {
  for (let i = 0; i < update.length; i++) {
    rules = rules.filter((rule) => rule.every((val) => update.includes(val)));
    const u = update[i];

    for (const r of rules) {
      const [a, b] = r;
      if (r.indexOf(u) === 0) {
        if (!update.slice(i).includes(b)) return false;
      } else if (r.indexOf(u) === 1) {
        if (!update.slice(0, i).includes(a)) return false;
      }
    }
  }
  return true;
};

const sumMiddlePageNumber = (
  rules: number[][],
  updates: number[][]
): number => {
  return updates.reduce((sum, val) => {
    const middleNum = val[Math.floor(val.length / 2)];
    return sum + (isValidUpdate(rules, val) ? middleNum : 0);
  }, 0);
};

console.log("Part 1: ", sumMiddlePageNumber(rules, updates));

const sumMiddlePageNumberWithInvalidRules = (
  rules: number[][],
  updates: number[][]
): number => {
  return updates
    .filter((u) => !isValidUpdate(rules, u))
    .reduce((sum, val) => {
      const middleIdx = Math.floor(val.length / 2);
      return sum + toValid(val, rules)[middleIdx];
    }, 0);
};

// Converts an invalid update to a valid one
const toValid = (update: number[], rules: number[][]): number[] => {
  const mustComeBefore: Record<number, Set<number>> = {};

  for (const num of update) {
    mustComeBefore[num] = new Set();
  }

  for (const [left, right] of rules) {
    if (update.includes(left) && update.includes(right)) {
      mustComeBefore[right].add(left);
    }
  }

  const result: number[] = [];
  const remaining = new Set(update);

  while (remaining.size > 0) {
    const available = Array.from(remaining).filter((num) =>
      Array.from(mustComeBefore[num]).every((dep) => !remaining.has(dep))
    );

    if (available.length === 0) {
      const next = Array.from(remaining)[0];
      result.push(next);
      remaining.delete(next);
    } else {
      const next = available[0];
      result.push(next);
      remaining.delete(next);
    }
  }

  return result;
};

console.log("Part 2: ", sumMiddlePageNumberWithInvalidRules(rules, updates));
