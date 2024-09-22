'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
const he = require('he');

type Article = {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  publishedAt: string;
  urlToImage: string | null;
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchArticles = () => {
    if (!topic.trim()) {
      setError('주제를 입력하세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiKey = '2b50df21b72a48f7a696f11a25947657';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&apiKey=${apiKey}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          const mappedArticles = data.articles.map((article: any) => ({
            id: article.url,
            title: article.title,
            summary: article.description || 'No summary available',
            content: article.content || 'No content available',
            url: article.url,
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage,
          }));
          setArticles(mappedArticles);
        } else {
          setError('뉴스를 불러오는 중 오류가 발생했습니다.');
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  };

  const handleAddFavorite = async (article:Article) => {
    const userId = localStorage.getItem('userId');  // 로그인 후 저장된 userId 가져오기
  
    console.log('Fetched userId:', userId);  // userId가 제대로 있는지 확인
  
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/favorites/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          url: article.url,
          description: article.summary,
        }),
      });
  
      if (response.ok) {
        alert('즐겨찾기에 추가되었습니다.');
      } else {
        alert('즐겨찾기 추가 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('즐겨찾기 추가 중 오류 발생:', error);
    }
  };
  
  
  
  
  

  const getDaysAgo = (dateString: string): string => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const timeDiff = now.getTime() - publishedDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

    if (daysDiff === 0) return '오늘';
    if (daysDiff === 1) return '어제';
    return `${daysDiff}일 전`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">주제별 뉴스 큐레이션</h1>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="주제를 입력하세요"
        className="border p-2 mb-4 w-full"
      />
      <button onClick={fetchArticles} className="bg-blue-500 text-white p-2 rounded mb-4">
        뉴스 검색
      </button>

      {error && <div className="text-red-500 mb-4">뉴스를 불러오는 중 오류가 발생했습니다: {error}</div>}
      {isLoading && <div>로딩 중...</div>}
      {!isLoading && !error && !articles.length && <div>검색 결과가 없습니다.</div>}

      {articles.map((article) => {
        const cleanedContent = article.content
          ? he.decode(article.content)
              .replace(/\[\+\s*\d+\s*chars\]/g, '')
              .replace(/\s+/g, ' ')
              .replace(/[\r\n]+/g, ' ')
              .trim()
          : 'No content available';

        return (
          <div key={article.id} className="mb-4 p-4 border rounded shadow">
            {article.urlToImage && (
              <img
                src={article.urlToImage}
                alt={article.title}
                className="mb-4 w-full h-64 object-cover rounded"
              />
            )}
            <h2
              className="text-xl font-semibold"
              dangerouslySetInnerHTML={{ __html: article.title }}
            ></h2>
            <p>{getDaysAgo(article.publishedAt)}에 작성됨</p>
            <p dangerouslySetInnerHTML={{ __html: article.summary }}></p>
            <Link href={article.url} className="text-blue-500 hover:underline" target="_blank">
              자세히 보기
            </Link>

            {/* 즐겨찾기 버튼 추가 */}
            <button
              onClick={() => handleAddFavorite(article)}
              className="mt-2 bg-yellow-500 text-white p-2 rounded"
            >
              즐겨찾기 추가
            </button>
          </div>
        );
      })}
    </div>
  );
}
