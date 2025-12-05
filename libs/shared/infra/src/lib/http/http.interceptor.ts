import { Injectable } from '@nestjs/common';
import {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * HTTP 요청 인터셉터
 * 
 * 모든 HTTP 요청에 공통 헤더를 추가하고 로깅합니다.
 */
@Injectable()
export class HttpRequestInterceptor {
  /**
   * 요청 전처리
   */
  onRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    // 요청 시작 시간 기록
    config.metadata = { startTime: new Date() };

    // 공통 헤더 추가
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }

    // 로깅
    console.log(
      `[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`,
      {
        headers: config.headers,
        params: config.params,
      }
    );

    return config;
  }

  /**
   * 요청 에러 처리
   */
  onRequestError(error: AxiosError): Promise<AxiosError> {
    console.error('[HTTP Request Error]', error.message);
    return Promise.reject(error);
  }
}

/**
 * HTTP 응답 인터셉터
 * 
 * 모든 HTTP 응답을 가로채서 로깅하고 에러 처리합니다.
 */
@Injectable()
export class HttpResponseInterceptor {
  /**
   * 응답 후처리
   */
  onResponse(response: AxiosResponse): AxiosResponse {
    // 응답 시간 계산
    const startTime = response.config.metadata?.startTime;
    const duration = startTime ? new Date().getTime() - startTime.getTime() : 0;

    console.log(
      `[HTTP Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
      {
        status: response.status,
        duration: `${duration}ms`,
      }
    );

    return response;
  }

  /**
   * 응답 에러 처리
   */
  onResponseError(error: AxiosError): Promise<AxiosError> {
    if (error.response) {
      // 서버 응답이 있는 경우 (4xx, 5xx)
      console.error('[HTTP Response Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우 (네트워크 오류)
      console.error('[HTTP Network Error]', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message,
      });
    } else {
      // 요청 설정 중 에러 발생
      console.error('[HTTP Config Error]', error.message);
    }

    return Promise.reject(error);
  }
}

/**
 * Axios 메타데이터 타입 확장
 */
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: Date;
    };
  }
}
