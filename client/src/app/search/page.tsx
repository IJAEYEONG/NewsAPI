'use client';

import React, { useState } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
}

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Article[]>([]);

  const handleSearch = async () => {
    if (searchTerm) {
      try {
        const response = await fetch(`http://localhost:4000/news/search?query=${searchTerm}`);
        const data: Article[] = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error searching for articles:', error);
      }
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요"
      />
      <button onClick={handleSearch}>검색</button>
      <div>
        {results.map((article) => (
          <div key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <a href={`/article/${article.id}`}>자세히 보기</a>
          </div>
        ))}
      </div>
    </div>
  );
}
