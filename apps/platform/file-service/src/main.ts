import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'file-service',
    port: 3044,
    globalPrefix: '',
  });
}

bootstrap();
