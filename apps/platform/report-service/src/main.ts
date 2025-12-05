import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Report Service 부트스트랩 함수
 * 보고서 생성 및 관리 서비스를 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'report-service',
    port: 3042,
    swagger: {
      title: 'Report Service API',
      description: '보고서 생성 및 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
