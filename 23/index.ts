const file = await Deno.readTextFile("input.txt");

type Graph = Map<string, Set<string>>;
const graph: Graph = new Map<string, Set<string>>();

const connections = file.trim().split("\n");
for (const con of connections) {
  const [a, b] = con.split("-");

  if (!graph.has(a)) graph.set(a, new Set());
  if (!graph.has(b)) graph.set(b, new Set());

  graph.get(a)!.add(b);
  graph.get(b)!.add(a);
}

const findConnectionTriangles = (): string[][] => {
  const triangles = new Set<string[]>();
  const nodes = Array.from(graph.keys());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const a = nodes[i];
        const b = nodes[j];
        const c = nodes[k];

        if (
          graph.get(a)!.has(b) &&
          graph.get(b)!.has(c) &&
          graph.get(c)!.has(a)
        ) {
          const triangle = [a, b, c].sort();
          triangles.add(triangle);
        }
      }
    }
  }

  return Array.from(triangles);
};

const part1 = () => {
  const total = findConnectionTriangles().filter(([x, y, z]) => {
    return x.startsWith("t") || y.startsWith("t") || z.startsWith("t");
  }).length;
  console.log("Part 1: ", total);
};

part1();
