/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'Payroll Service',
    port: Number(process.env.PORT) || 3012,
    swagger: {
      title: 'Payroll Service',
      description: '급여 계산 및 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
