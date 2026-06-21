import type { RedditPost } from "@/types";

const SUBREDDIT = "girlscouts";
const REDDIT_API = "https://oauth.reddit.com";
const TOKEN_URL = "https://www.reddit.com/api/v1/access_token";

interface RedditListingChild {
  data: {
    id: string;
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    author: string;
    created_utc: number;
    permalink: string;
    link_flair_text: string | null;
  };
}

interface RedditListing {
  data: {
    children: RedditListingChild[];
    after: string | null;
  };
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const userAgent = process.env.REDDIT_USER_AGENT ?? "GirlScoutRedditAnalyzer/1.0";

  if (!clientId || !clientSecret) {
    throw new Error("Reddit API credentials are not configured");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to get Reddit access token: ${text}`);
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

function mapPost(child: RedditListingChild): RedditPost {
  const { data } = child;
  return {
    id: data.id,
    title: data.title,
    body: data.selftext ?? "",
    score: data.score,
    comments: data.num_comments,
    author: data.author,
    createdAt: new Date(data.created_utc * 1000),
    permalink: `https://www.reddit.com${data.permalink}`,
    flair: data.link_flair_text,
  };
}

async function fetchListing(
  accessToken: string,
  sort: "hot" | "new" | "top",
  options?: { time?: "year"; after?: string }
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const userAgent = process.env.REDDIT_USER_AGENT ?? "GirlScoutRedditAnalyzer/1.0";
  const params = new URLSearchParams({ limit: "100" });
  if (sort === "top" && options?.time) {
    params.set("t", options.time);
  }
  if (options?.after) {
    params.set("after", options.after);
  }

  const url = `${REDDIT_API}/r/${SUBREDDIT}/${sort}?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch Reddit ${sort} posts: ${text}`);
  }

  const listing = (await response.json()) as RedditListing;
  return {
    posts: listing.data.children.map(mapPost),
    after: listing.data.after,
  };
}

async function fetchAllPosts(
  accessToken: string,
  sort: "hot" | "new" | "top",
  options?: { time?: "year"; maxPages?: number }
): Promise<RedditPost[]> {
  const maxPages = options?.maxPages ?? 5;
  const allPosts: RedditPost[] = [];
  let after: string | null = null;

  for (let page = 0; page < maxPages; page++) {
    const result = await fetchListing(accessToken, sort, {
      time: options?.time,
      after: after ?? undefined,
    });
    allPosts.push(...result.posts);
    if (!result.after) break;
    after = result.after;
  }

  return allPosts;
}

export async function fetchGirlScoutPosts(): Promise<RedditPost[]> {
  const accessToken = await getAccessToken();

  const [hotPosts, topPosts, newPosts] = await Promise.all([
    fetchAllPosts(accessToken, "hot", { maxPages: 3 }),
    fetchAllPosts(accessToken, "top", { time: "year", maxPages: 10 }),
    fetchAllPosts(accessToken, "new", { maxPages: 5 }),
  ]);

  const postMap = new Map<string, RedditPost>();
  for (const post of [...hotPosts, ...topPosts, ...newPosts]) {
    postMap.set(post.id, post);
  }

  return Array.from(postMap.values());
}
