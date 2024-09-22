'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// JWT 토큰에서 페이로드를 디코딩하여 userId 추출
const decodeJWT = (token: string) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  // 로그인 요청 후 처리
  const handleLogin = async () => {
    console.log('로그인 요청:', { email, password });

    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('서버 응답:', data);

    if (response.ok && data.access_token) {
      // JWT 토큰에서 sub (userId) 추출
      const decodedToken = decodeJWT(data.access_token);
      console.log('디코딩된 토큰:', decodedToken); // sub 확인

      const userId = decodedToken.sub; // 토큰에서 sub 추출
      if (userId) {
        localStorage.setItem('userId', userId); // 로컬 스토리지에 userId 저장
        router.push('/'); // 로그인 성공 시 메인 페이지로 이동
      } else {
        setError('userId가 토큰에 없습니다.');
      }
    } else {
      setError(data.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
      <button
        onClick={() => (window.location.href = 'http://localhost:4000/auth/kakao-login')}
      >
        카카오톡으로 로그인
      </button>
    </div>
  );
}
