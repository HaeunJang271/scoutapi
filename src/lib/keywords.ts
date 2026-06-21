const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "as", "is", "was", "are", "were", "been", "be", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
  "i", "me", "my", "we", "our", "you", "your", "he", "she", "it", "they", "them",
  "their", "this", "that", "these", "those", "what", "which", "who", "whom", "when",
  "where", "why", "how", "all", "each", "every", "both", "few", "more", "most",
  "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than",
  "too", "very", "just", "can", "about", "into", "through", "during", "before",
  "after", "above", "below", "up", "down", "out", "off", "over", "under", "again",
  "further", "then", "once", "here", "there", "any", "if", "because", "until",
  "while", "also", "get", "got", "like", "one", "two", "im", "ive", "dont", "didnt",
  "doesnt", "cant", "wont", "isnt", "wasnt", "arent", "werent", "thats", "theres",
  "really", "even", "still", "much", "many", "well", "back", "way", "want", "need",
  "know", "think", "going", "goes", "went", "come", "came", "make", "made", "take",
  "took", "see", "saw", "say", "said", "tell", "told", "ask", "asked", "give",
  "given", "put", "let", "try", "tried", "use", "used", "find", "found", "look",
  "looked", "help", "helped", "work", "worked", "call", "called", "feel", "felt",
  "keep", "kept", "start", "started", "show", "showed", "hear", "heard", "play",
  "run", "move", "live", "believe", "bring", "happen", "write", "provide", "sit",
  "stand", "lose", "pay", "meet", "include", "continue", "set", "learn", "change",
  "lead", "understand", "watch", "follow", "stop", "create", "speak", "read",
  "allow", "add", "spend", "grow", "open", "walk", "win", "offer", "remember",
  "love", "consider", "appear", "buy", "wait", "serve", "die", "send", "expect",
  "build", "stay", "fall", "cut", "reach", "kill", "remain", "suggest", "raise",
  "pass", "sell", "require", "report", "decide", "pull", "reddit", "post", "comment",
  "edit", "deleted", "removed", "https", "http", "www", "com", "amp", "nbsp",
]);

const PHRASES = [
  "gold award",
  "silver award",
  "girl scout",
  "girl scouts",
  "cookie sale",
  "cookie sales",
  "troop leader",
  "day camp",
  "summer camp",
];

export function extractKeywords(texts: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();
  const combined = texts.join(" ").toLowerCase();

  for (const phrase of PHRASES) {
    const regex = new RegExp(phrase.replace(/\s+/g, "\\s+"), "gi");
    const matches = combined.match(regex);
    if (matches) {
      frequencies.set(phrase, (frequencies.get(phrase) ?? 0) + matches.length);
    }
  }

  const words = combined
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  for (const word of words) {
    const normalized = word.replace(/^'+|'+$/g, "");
    if (normalized.length > 2) {
      frequencies.set(normalized, (frequencies.get(normalized) ?? 0) + 1);
    }
  }

  return frequencies;
}

export function getTopKeywords(
  frequencies: Map<string, number>,
  limit = 50
): { keyword: string; frequency: number }[] {
  return Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, frequency]) => ({ keyword, frequency }));
}
