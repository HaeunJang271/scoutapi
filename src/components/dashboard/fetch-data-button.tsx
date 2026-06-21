"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FetchDataButton({ onSuccess }: { onSuccess?: () => void }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetch = async () => {
    if (!session) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/reddit/fetch", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "데이터 수집 실패");
      }

      setMessage(
        `수집 완료: ${data.total}개 (신규 ${data.created}, 업데이트 ${data.updated})`
      );
      onSuccess?.();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "데이터 수집 중 오류 발생"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleFetch} disabled={loading}>
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Download className="mr-2 h-4 w-4" />
        )}
        최신 데이터 가져오기
      </Button>
      {message && (
        <p className="text-sm text-slate-600">{message}</p>
      )}
    </div>
  );
}
