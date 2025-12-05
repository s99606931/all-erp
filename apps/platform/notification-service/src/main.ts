import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Notification Service 부트스트랩 함수
 * 알림 발송 서비스를 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'notification-service',
    port: 3043,
    swagger: {
      title: 'Notification Service API',
      description: '알림 발송 및 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
