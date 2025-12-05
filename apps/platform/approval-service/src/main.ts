import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'approval-service',
    port: 3041,
    swagger: {
      title: 'Approval Service API',
      description: '결재 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
