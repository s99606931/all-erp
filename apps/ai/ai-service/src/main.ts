import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * AI Service 부트스트랩 함수
 * 공통 부트스트랩 서비스를 사용하여 애플리케이션을 초기화합니다.
 */
bootstrapService({
  module: AppModule,
  serviceName: 'AI Service',
  port: Number(process.env.PORT) || 3007,
  globalPrefix: 'api',
  swagger: {
    title: 'AI Service',
    description: 'AI 기능 및 LLM 연동 API',
    version: '1.0',
  },
});
