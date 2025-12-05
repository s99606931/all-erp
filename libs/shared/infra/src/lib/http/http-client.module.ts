import { Module, Global } from '@nestjs/common';
import { HttpModule as NestHttpModule } from '@nestjs/axios';
import { BaseHttpClient } from './base-http.client';
import { HttpRequestInterceptor, HttpResponseInterceptor } from './http.interceptor';
import { PersonnelServiceClient } from './personnel-service.client';
import { BudgetServiceClient } from './budget-service.client';
import { ApprovalServiceClient } from './approval-service.client';
import { FileServiceClient } from './file-service.client';
import { NotificationServiceClient } from './notification-service.client';

/**
 * HTTP 통신 공통 모듈
 * 
 * 서비스 간 HTTP 통신을 위한 클라이언트들을 제공합니다.
 * @Global 데코레이터로 전역 모듈로 선언하여 모든 서비스에서 사용 가능합니다.
 */
@Global()
@Module({
  imports: [
    NestHttpModule.register({
      timeout: 5000, // 기본 타임아웃 5초
      maxRedirects: 5,
    }),
  ],
  providers: [
    // 인터셉터
    HttpRequestInterceptor,
    HttpResponseInterceptor,

    // 기본 HTTP 클라이언트
    BaseHttpClient,

    // 서비스별 클라이언트
    PersonnelServiceClient,
    BudgetServiceClient,
    ApprovalServiceClient,
    FileServiceClient,
    NotificationServiceClient,
  ],
  exports: [
    // 기본 HTTP 클라이언트
    BaseHttpClient,

    // 서비스별 클라이언트
    PersonnelServiceClient,
    BudgetServiceClient,
    ApprovalServiceClient,
    FileServiceClient,
    NotificationServiceClient,
  ],
})
export class HttpClientModule {}
