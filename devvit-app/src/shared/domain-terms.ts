// Category rules keywords + additional Girl Scout domain terms
export const GIRL_SCOUT_DOMAIN_TERMS = [
  // From category rules
  'cookie', 'cookies', 'cookie sale', 'cookie sales', 'cookie booth',
  'samoas', 'thin mints', 'tagalongs', 'trefoils', 'adventurefuls',
  'badge', 'badges', 'patch', 'patches', 'journey', 'journeys',
  'camp', 'camping', 'hiking', 'outdoor', 'day camp', 'summer camp', 'backpacking',
  'leadership', 'leader', 'cadette', 'senior', 'ambassador', 'council',
  'gold award', 'gold project', 'silver award', 'silver project',
  'troop', 'daisy', 'brownie', 'junior', 'meeting', 'parent', 'volunteer',
  'stem', 'robotics', 'coding', 'science', 'technology', 'engineering',
  'service', 'community service', 'charity', 'donation',
  'world thinking day', 'international', 'global', 'exchange', 'wagggs',
  // Additional domain terms
  'girl scout', 'girl scouts', 'gsusa', 'scout', 'scouts', 'scouting',
  'troop leader', 'co-leader', 'leader', 'uniform', 'vest', 'sash', 'pin',
  'bridging', 'fly-up', 'journey', 'petal', 'petals',
  'booth', 'sales', 'selling', 'order', 'orders',
  'campfire', 'camping', 'overnight', 'sleepaway',
  'merit', 'award', 'awards', 'project',
  'fundraising', 'fundraiser', 'donate',
  'gs', 'gsnyc', 'council',
] as const;

// Common r/girlscouts words that are not domain-specific
const WORD_CLOUD_NOISE = new Set([
  'help', 'question', 'questions', 'anyone', 'thanks', 'thank', 'please',
  'advice', 'looking', 'need', 'wanted', 'wondering', 'update', 'updated',
  'year', 'years', 'old', 'daughter', 'daughters', 'son', 'kids', 'child',
  'children', 'mom', 'mother', 'parenting', 'school', 'time', 'first',
  'new', 'just', 'got', 'getting', 'made', 'make', 'did', 'does', 'done',
  'today', 'week', 'month', 'ago', 'started', 'start', 'starting',
  'idea', 'ideas', 'experience', 'experiences', 'recommend', 'suggestions',
  'subreddit', 'reddit', 'post', 'posted', 'comment', 'comments',
]);

export function isGirlScoutRelatedKeyword(keyword: string): boolean {
  const normalized = keyword.toLowerCase().trim();
  if (!normalized || WORD_CLOUD_NOISE.has(normalized)) return false;

  for (const term of GIRL_SCOUT_DOMAIN_TERMS) {
    if (normalized === term) return true;
    if (term.includes(' ') && normalized.includes(term)) return true;
    if (!term.includes(' ') && normalized === term) return true;
    if (!term.includes(' ') && normalized.includes(term) && term.length >= 4) return true;
  }

  return false;
}

export function filterGirlScoutKeywords(
  keywords: { keyword: string; frequency: number }[],
  limit = 30
): { keyword: string; frequency: number }[] {
  return keywords.filter((kw) => isGirlScoutRelatedKeyword(kw.keyword)).slice(0, limit);
}
