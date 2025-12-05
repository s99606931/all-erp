import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/auth.store';

// API 클라이언트 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 에러 처리 및 자동 로그아웃
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답은 그대로 반환
    return response;
  },
  (error) => {
    // 401 Unauthorized: 토큰 만료 또는 인증 실패
    if (error.response?.status === 401) {
      // 사용자 로그아웃 처리
      useAuthStore.getState().logout();
      
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    
    // 403 Forbidden: 권한 없음
    if (error.response?.status === 403) {
      console.error('접근 권한이 없습니다.');
    }
    
    // 500 Internal Server Error: 서버 오류
    if (error.response?.status === 500) {
      console.error('서버 오류가 발생했습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
