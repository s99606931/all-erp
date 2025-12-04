/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * System Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'system-service',
    port: Number(process.env.PORT) || 3002,
    swagger: {
      title: 'System Service',
      description: 'System & Common API',
      version: '1.0',
    },
  });
}

bootstrap();
