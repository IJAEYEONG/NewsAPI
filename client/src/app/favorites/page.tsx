'use client';

import React, { useEffect, useState } from 'react';  // React에서 훅 불러오기

type Favorite = {
  id: number;
  title: string;
  description: string;
  url: string;
};

export default function FavoriteList() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);  // Favorite 타입으로 상태 정의

  useEffect(() => {
    const userId = localStorage.getItem('userId'); 

    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    // API를 호출해서 즐겨찾기 목록을 가져옴
    const fetchFavorites = async () => {
      const response = await fetch(`http://localhost:4000/favorites/${userId}`);
      const data = await response.json();
      setFavorites(data);
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>내 즐겨찾기 목록</h1>
      {favorites.length === 0 ? (
        <p>즐겨찾기한 뉴스가 없습니다.</p>
      ) : (
        <ul>
          {favorites.map((favorite: Favorite) => (  // favorite 매개변수에 타입 지정
            <li key={favorite.id}>
              <h2>{favorite.title}</h2>
              <p>{favorite.description}</p>
              <a href={favorite.url} target="_blank" rel="noopener noreferrer">
                기사 보기
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
