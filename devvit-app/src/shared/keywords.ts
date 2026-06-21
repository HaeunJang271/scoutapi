const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it', 'they', 'them',
  'their', 'this', 'that', 'these', 'those', 'what', 'which', 'who', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
  'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 'just', 'can', 'about', 'into', 'through', 'during', 'before', 'after',
  'also', 'get', 'got', 'like', 'one', 'im', 'ive', 'dont', 'really', 'even', 'still',
  'much', 'many', 'well', 'back', 'way', 'want', 'need', 'know', 'think', 'going',
  'reddit', 'post', 'comment', 'edit', 'deleted', 'removed', 'https', 'http', 'www',
]);

const PHRASES = [
  'gold award', 'silver award', 'girl scout', 'girl scouts',
  'cookie sale', 'cookie sales', 'troop leader', 'day camp', 'summer camp',
];

export function extractKeywords(texts: string[]): Map<string, number> {
  const frequencies = new Map<string, number>();
  const combined = texts.join(' ').toLowerCase();

  for (const phrase of PHRASES) {
    const regex = new RegExp(phrase.replace(/\s+/g, '\\s+'), 'gi');
    const matches = combined.match(regex);
    if (matches) {
      frequencies.set(phrase, (frequencies.get(phrase) ?? 0) + matches.length);
    }
  }

  const words = combined
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  for (const word of words) {
    const normalized = word.replace(/^'+|'+$/g, '');
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
