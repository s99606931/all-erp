import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Budget Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'budget-service',
    port: Number(process.env.PORT) || 3021,
    swagger: {
      title: 'Budget Service',
      description: 'The budget service API description',
      version: '1.0',
    },
  });
}

bootstrap();
