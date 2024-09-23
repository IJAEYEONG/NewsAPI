'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // 로그인 여부를 관리하는 상태
  const router = useRouter();

  // 로그인 상태 확인
  useEffect(() => {
    const userId = localStorage.getItem('userId'); // localStorage에서 userId 가져오기
    if (userId) {
      setIsLoggedIn(true); // userId가 있으면 로그인 상태로 설정
    } else {
      setIsLoggedIn(false); // 없으면 비로그인 상태
    }
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    localStorage.removeItem('userId'); // localStorage에서 userId 삭제
    setIsLoggedIn(false); // 로그인 상태를 false로 변경
    router.push('/'); // 로그아웃 후 홈으로 이동
  };

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

  const handleAddFavorite = async (article: Article) => {
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
    <div className="container mx-auto p-6">
      {/* 상단 네비게이션 바 */}
      <div className="flex justify-end space-x-4 mb-6">
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => router.push('/login')}  // 회원가입 버튼 삭제, 로그인만 표시
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              로그인
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/favorites')}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
            >
              즐겨찾기 보기
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
            >
              로그아웃
            </button>
          </>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">주제별 뉴스 큐레이션</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="주제를 입력하세요"
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-1/2 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchArticles}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          뉴스 검색
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-4 text-center">
          뉴스를 불러오는 중 오류가 발생했습니다: {error}
        </div>
      )}
      {isLoading && <div className="text-center">로딩 중...</div>}
      {!isLoading && !error && !articles.length && (
        <div className="text-center text-gray-500">검색 결과가 없습니다.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => {
          const cleanedContent = article.content
            ? he.decode(article.content)
                .replace(/\[\+\s*\d+\s*chars\]/g, '')
                .replace(/\s+/g, ' ')
                .replace(/[\r\n]+/g, ' ')
                .trim()
            : 'No content available';

          return (
            <div key={article.id} className="bg-white p-6 border rounded-lg shadow-lg">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="mb-4 w-full h-48 object-cover rounded-lg"
                />
              )}
              <h2
                className="text-xl font-semibold mb-2"
                dangerouslySetInnerHTML={{ __html: article.title }}
              ></h2>
              <p className="text-sm text-gray-600 mb-4">
                {getDaysAgo(article.publishedAt)}에 작성됨
              </p>
              <p className="text-sm mb-4" dangerouslySetInnerHTML={{ __html: article.summary }}></p>
              <Link href={article.url} className="text-blue-500 hover:underline" target="_blank">
                자세히 보기
              </Link>
              <button
                onClick={() => handleAddFavorite(article)}
                className="mt-4 w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
              >
                즐겨찾기 추가
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
