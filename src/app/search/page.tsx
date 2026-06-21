"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/types";
import { formatDate } from "@/lib/utils";
import { Search, ExternalLink } from "lucide-react";

interface Post {
  id: string;
  title: string;
  body: string;
  score: number;
  comments: number;
  author: string;
  createdAt: string;
  permalink: string;
  category: string;
  flair: string | null;
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchPage = 1) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(searchPage),
      limit: "20",
    });
    if (keyword) params.set("keyword", keyword);
    if (category !== "all") params.set("category", category);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    try {
      const res = await fetch(`/api/posts/search?${params}`);
      const data = await res.json();
      setPosts(data.posts);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">게시글 검색</h1>
          <p className="text-sm text-slate-500">
            키워드, 카테고리, 날짜로 게시글을 검색합니다
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>검색 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="keyword">키워드</Label>
                <Input
                  id="keyword"
                  placeholder="검색어 입력..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>카테고리</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">시작일</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">종료일</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={() => handleSearch(1)}
              disabled={loading}
            >
              <Search className="mr-2 h-4 w-4" />
              검색
            </Button>
          </CardContent>
        </Card>

        {total > 0 && (
          <p className="text-sm text-slate-500">총 {total}개 결과</p>
        )}

        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      {post.flair && (
                        <Badge variant="outline">{post.flair}</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{post.title}</h3>
                    {post.body && (
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {post.body}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>u/{post.author}</span>
                      <span>업보트 {post.score}</span>
                      <span>댓글 {post.comments}</span>
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => handleSearch(page - 1)}
            >
              이전
            </Button>
            <span className="flex items-center px-4 text-sm">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => handleSearch(page + 1)}
            >
              다음
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
