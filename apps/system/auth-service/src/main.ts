/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Auth Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'auth-service',
    port: Number(process.env.PORT) || 3001,
    swagger: {
      title: 'Auth Service',
      description: 'Authentication & Authorization API',
      version: '1.0',
    },
  });
}

bootstrap();
