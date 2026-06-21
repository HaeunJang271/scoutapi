"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WordCloudProps {
  data: { keyword: string; frequency: number }[];
}

export function WordCloud({ data }: WordCloudProps) {
  const maxFreq = Math.max(...data.map((d) => d.frequency), 1);

  const getSize = (freq: number) => {
    const ratio = freq / maxFreq;
    return Math.max(12, Math.round(ratio * 48));
  };

  const getColor = (index: number) => {
    const colors = [
      "#059669", "#2563eb", "#7c3aed", "#db2777", "#ea580c",
      "#ca8a04", "#0891b2", "#4f46e5", "#be185d", "#65a30d",
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>워드클라우드</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex min-h-[300px] flex-wrap items-center justify-center gap-3 p-4">
          {data.map((item, index) => (
            <span
              key={item.keyword}
              style={{
                fontSize: `${getSize(item.frequency)}px`,
                color: getColor(index),
                lineHeight: 1.2,
              }}
              className="cursor-default font-semibold transition-transform hover:scale-110"
              title={`${item.keyword}: ${item.frequency}회`}
            >
              {item.keyword}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
