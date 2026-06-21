import type { Category } from './api';

const CATEGORY_RULES: { category: Category; keywords: string[] }[] = [
  { category: '쿠키 판매', keywords: ['cookie', 'cookies', 'cookie sale', 'cookie booth', 'samoas', 'thin mints'] },
  { category: '배지 활동', keywords: ['badge', 'badges', 'patch', 'patches', 'journey', 'journeys'] },
  { category: '캠핑/야외활동', keywords: ['camp', 'camping', 'hiking', 'outdoor', 'day camp', 'summer camp'] },
  { category: '리더십', keywords: ['leadership', 'leader', 'cadette', 'senior', 'ambassador', 'council'] },
  { category: 'Gold Award', keywords: ['gold award', 'gold project'] },
  { category: 'Silver Award', keywords: ['silver award', 'silver project'] },
  { category: '부대(Troop) 운영', keywords: ['troop', 'daisy', 'brownie', 'junior', 'meeting', 'parent', 'volunteer'] },
  { category: 'STEM', keywords: ['stem', 'robotics', 'coding', 'science', 'technology', 'engineering'] },
  { category: '봉사활동', keywords: ['service', 'volunteer', 'community service', 'charity', 'donation'] },
  { category: '국제교류', keywords: ['world thinking day', 'international', 'global', 'exchange', 'wagggs'] },
];

export function categorizePost(title: string, body: string): Category {
  const text = `${title} ${body}`.toLowerCase();
  let bestCategory: Category = '기타';
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        score += keyword.includes(' ') ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}
