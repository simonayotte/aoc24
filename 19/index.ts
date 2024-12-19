const [towels, designs] = await Deno.readTextFile("input.txt")
  .then((file) => file.split("\n\n"))
  .then(([t, d]) => [t.split(", "), d.split("\n")]);

class TrieNode {
  children: Record<string, TrieNode>;
  canEnd: boolean;

  constructor() {
    this.children = {};
    this.canEnd = false;
  }
}

class Trie {
  private root: TrieNode;

  constructor(words: string[]) {
    this.root = new TrieNode();
    words.forEach((word) => {
      let current = this.root;
      for (const char of word) {
        current.children[char] = current.children[char] || new TrieNode();
        current = current.children[char];
      }
      current.canEnd = true;
    });
  }

  private match(word: string, countAll: boolean): number | boolean {
    const dp = new Array(word.length + 1).fill(countAll ? 0 : false);
    dp[0] = countAll ? 1 : true;

    for (let i = 0; i < word.length; i++) {
      if (!dp[i]) continue;

      let current = this.root;
      for (let j = i; j < word.length; j++) {
        if (!current.children[word[j]]) break;
        current = current.children[word[j]];
        if (current.canEnd) {
          if (countAll) {
            dp[j + 1] += dp[i];
          } else {
            dp[j + 1] = true;
          }
        }
      }
    }

    return dp[word.length];
  }

  search = (word: string): boolean => this.match(word, false) as boolean;
  countWays = (word: string): number => this.match(word, true) as number;
}

const trie = new Trie(towels);

console.log("Part 1:", designs.filter((d) => trie.search(d)).length);

console.log(
  "Part 2:",
  designs.reduce((sum, d) => sum + trie.countWays(d), 0)
);
