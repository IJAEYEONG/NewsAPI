'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [name, setName] = useState(''); // 이름 입력 필드 추가
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가
  const router = useRouter();

  const handleRegister = async () => {
    if (name && email && password) {
      setIsLoading(true); // 로딩 시작
      setError(''); // 기존 오류 메시지 초기화
      try {
        const response = await fetch('http://localhost:4000/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }), // 회원가입 시 이름, 이메일, 비밀번호 전송
        });

        if (response.ok) {
          router.push('/login'); // 회원가입 성공 시 로그인 페이지로 이동
        } else {
          const data = await response.json();
          setError(data.message || '회원가입에 실패했습니다.');
        }
      } catch (error) {
        setError('회원가입 처리 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false); // 로딩 끝
      }
    } else {
      setError('이름, 이메일, 비밀번호를 모두 입력해야 합니다.');
    }
  };

  return (
    <div>
      <h1>회원가입</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름"
      />
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
      <button onClick={handleRegister} disabled={isLoading}>
        {isLoading ? '회원가입 중...' : '회원가입'}
      </button>
    </div>
  );
}
