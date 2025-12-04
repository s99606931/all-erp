import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'Settlement Service',
    port: Number(process.env.PORT) || 3023,
    swagger: {
      title: 'Settlement Service',
      description: '결산 관리 API',
      version: '1.0',
    },
  });
}

bootstrap();
