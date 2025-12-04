import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Supply Service 부트스트랩 함수
 * 공통 부트스트랩 서비스를 사용하여 애플리케이션을 초기화합니다.
 */
bootstrapService({
  module: AppModule,
  serviceName: 'Supply Service',
  port: Number(process.env.PORT) || 3032,
  globalPrefix: 'api',
  swagger: {
    title: 'Supply Service',
    description: '비품 관리 API',
    version: '1.0',
  },
});
