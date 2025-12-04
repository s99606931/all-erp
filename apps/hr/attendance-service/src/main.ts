/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'Attendance Service',
    port: Number(process.env.PORT) || 3013,
    swagger: {
      title: 'Attendance Service',
      description: '근태 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
