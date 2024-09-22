"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Article = {
  id: string;
  title: string;
  content: string;
  summary?: string;
};

export default function ArticleDetail() {
  const params = useParams();
  let id = params.id;

  if (Array.isArray(id)) {
    id = id[0];
  }

  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("ID가 제공되지 않았습니다.");
      return;
    }

    fetch(`http://localhost:4000/news/${encodeURIComponent(id as string)}`)
      .then((res) => res.json())
      .then((data) => {
        // HTML 특수 문자 디코딩 및 공백 처리
        let cleanedContent = data.content
          .replace(/&nbsp;/g, ' ') // 불필요한 공백을 일반 공백으로 변환
          .replace(/&quot;/g, '"')  // 큰따옴표로 변환
          .replace(/&apos;/g, "'")  // 작은따옴표로 변환
          .replace(/&amp;/g, '&')   // 앰퍼샌드(&)로 변환
          .replace(/&lt;/g, '<')    // 'less than' 기호로 변환
          .replace(/&gt;/g, '>')    // 'greater than' 기호로 변환
          .replace(/\s+/g, ' ')     // 여러 개의 공백을 하나의 공백으로 변환
          .trim();                  // 앞뒤 불필요한 공백 제거

        setArticle({
          ...data,
          content: cleanedContent,
        });
      })
      .catch((error) => {
        console.error('Error fetching article:', error);
      });
  }, [id]);

  if (!article) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">{article.title}</h1>
      <p className="mb-4">{article.summary}</p>
      <div className="article-content">
  {article.content}
</div>
    </div>
  );
}
