import type { Category } from "@/types";

interface CategoryRule {
  category: Category;
  keywords: string[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: "쿠키 판매",
    keywords: ["cookie", "cookies", "cookie sale", "cookie booth", "samoas", "thin mints", "tagalongs"],
  },
  {
    category: "배지 활동",
    keywords: ["badge", "badges", "patch", "patches", "journey", "journeys"],
  },
  {
    category: "캠핑/야외활동",
    keywords: ["camp", "camping", "hiking", "outdoor", "day camp", "summer camp", "backpacking"],
  },
  {
    category: "리더십",
    keywords: ["leadership", "leader", "cadette", "senior", "ambassador", "council"],
  },
  {
    category: "Gold Award",
    keywords: ["gold award", "gold project"],
  },
  {
    category: "Silver Award",
    keywords: ["silver award", "silver project"],
  },
  {
    category: "부대(Troop) 운영",
    keywords: ["troop", "daisy", "brownie", "junior", "meeting", "parent", "volunteer"],
  },
  {
    category: "STEM",
    keywords: ["stem", "robotics", "coding", "science", "technology", "engineering", "math"],
  },
  {
    category: "봉사활동",
    keywords: ["service", "volunteer", "community service", "charity", "donation"],
  },
  {
    category: "국제교류",
    keywords: ["world thinking day", "international", "global", "exchange", "wagggs"],
  },
];

export function categorizePost(title: string, body: string): Category {
  const text = `${title} ${body}`.toLowerCase();
  let bestCategory: Category = "기타";
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (text.includes(keyword)) {
        score += keyword.includes(" ") ? 3 : 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.category;
    }
  }

  return bestCategory;
}

export function getCategoryCounts(
  posts: { category: string }[]
): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
