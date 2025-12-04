import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * General Affairs Service 부트스트랩 함수
 * 공통 부트스트랩 서비스를 사용하여 애플리케이션을 초기화합니다.
 */
bootstrapService({
  module: AppModule,
  serviceName: 'General Affairs Service',
  port: Number(process.env.PORT) || 3033,
  globalPrefix: 'api',
  swagger: {
    title: 'General Affairs Service',
    description: '총무 관리 API',
    version: '1.0',
  },
});
