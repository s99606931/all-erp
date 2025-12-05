import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/common';

// 인증 상태 인터페이스
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // 액션
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
}

// API 응답 타입
interface LoginResponse {
  user: User;
  token: string;
}

// 인증 스토어
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // 로그인 처리
      login: async (email: string, password: string) => {
        try {
          const response = await fetch('http://localhost:3001/api/v1/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error('로그인에 실패했습니다.');
          }

          const data: LoginResponse = await response.json();

          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('로그인 오류:', error);
          throw error;
        }
      },

      // 로그아웃 처리
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      // 사용자 정보 설정 (토큰 갱신 등에 사용)
      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
    }),
    { 
      name: 'auth-storage',
      // 토큰과 사용자 정보를 localStorage에 저장
    }
  )
);
