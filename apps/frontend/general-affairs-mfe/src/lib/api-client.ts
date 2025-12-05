import axios from 'axios';

/**
 * 총무 관리 API 베이스 URL
 * 실제 환경에서는 환경 변수로 관리되어야 합니다.
 */
const API_BASE_URL = import.meta.env.VITE_GENERAL_AFFAIRS_API_URL || 'http://localhost:3010';

/**
 * Axios 인스턴스 생성
 * - 기본 URL 설정
 * - 요청/응답 인터셉터 추가
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 * - 인증 토큰 추가
 * - Tenant ID 추가
 */
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있으면 헤더에 추가
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tenant ID 추가
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * - 에러 처리
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 인증 실패 시 로그인 페이지로 리다이렉트
      console.error('인증 실패: 로그인이 필요합니다.');
      // TODO: 로그인 페이지로 리다이렉트
    }
    return Promise.reject(error);
  }
);

export default apiClient;
