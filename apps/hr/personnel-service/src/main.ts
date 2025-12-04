/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'Personnel Service',
    port: Number(process.env.PORT) || 3011,
    swagger: {
      title: 'Personnel Service',
      description: '인사 정보 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
