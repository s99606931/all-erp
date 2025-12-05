import { Injectable, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpRequestInterceptor, HttpResponseInterceptor } from './http.interceptor';

/**
 * HTTP 클라이언트 기본 설정
 */
export interface HttpClientConfig {
  /** 요청 타임아웃 (밀리초) */
  timeout?: number;
  /** 재시도 횟수 */
  retries?: number;
  /** 재시도 간격 (밀리초) */
  retryDelay?: number;
}

/**
 * 기본 HTTP 클라이언트
 * 
 * 서비스 간 HTTP 통신을 위한 기본 클라이언트입니다.
 * 타임아웃, 재시도, 로깅 등의 공통 기능을 제공합니다.
 */
@Injectable()
export class BaseHttpClient implements OnModuleInit {
  private readonly defaultConfig: HttpClientConfig = {
    timeout: 5000, // 5초
    retries: 3,
    retryDelay: 1000, // 1초
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly requestInterceptor: HttpRequestInterceptor,
    private readonly responseInterceptor: HttpResponseInterceptor,
  ) {}

  /**
   * 모듈 초기화 시 인터셉터 등록
   */
  onModuleInit() {
    const axiosInstance = this.httpService.axiosRef;

    // 요청 인터셉터
    axiosInstance.interceptors.request.use(
      (config) => this.requestInterceptor.onRequest(config),
      (error) => this.requestInterceptor.onRequestError(error)
    );

    // 응답 인터셉터
    axiosInstance.interceptors.response.use(
      (response) => this.responseInterceptor.onResponse(response),
      (error) => this.responseInterceptor.onResponseError(error)
    );
  }

  /**
   * GET 요청
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const response = await this.retryRequest(() =>
      firstValueFrom(this.httpService.get<T>(url, mergedConfig))
    );
    return response.data;
  }

  /**
   * POST 요청
   */
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const response = await this.retryRequest(() =>
      firstValueFrom(this.httpService.post<T>(url, data, mergedConfig))
    );
    return response.data;
  }

  /**
   * PUT 요청
   */
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const response = await this.retryRequest(() =>
      firstValueFrom(this.httpService.put<T>(url, data, mergedConfig))
    );
    return response.data;
  }

  /**
   * PATCH 요청
   */
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const response = await this.retryRequest(() =>
      firstValueFrom(this.httpService.patch<T>(url, data, mergedConfig))
    );
    return response.data;
  }

  /**
   * DELETE 요청
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const mergedConfig = this.mergeConfig(config);
    const response = await this.retryRequest(() =>
      firstValueFrom(this.httpService.delete<T>(url, mergedConfig))
    );
    return response.data;
  }

  /**
   * 설정 병합
   */
  private mergeConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...config,
      timeout: config?.timeout || this.defaultConfig.timeout,
    };
  }

  /**
   * 재시도 로직
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      // 재시도 가능한 오류인지 확인
      if (this.shouldRetry(error) && attempt < (this.defaultConfig.retries || 3)) {
        console.warn(
          `[HTTP Retry] Attempt ${attempt}/${this.defaultConfig.retries} failed, retrying...`
        );

        // 재시도 전 대기
        await this.delay(this.defaultConfig.retryDelay || 1000);

        return this.retryRequest(requestFn, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * 재시도 가능 여부 확인
   */
  private shouldRetry(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;

    const axiosError = error as { response?: { status?: number }; code?: string };

    // 네트워크 오류
    if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
      return true;
    }

    // 5xx 서버 에러
    if (axiosError.response?.status && axiosError.response.status >= 500) {
      return true;
    }

    return false;
  }

  /**
   * 지연 유틸리티
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
