import { bootstrapService } from '@all-erp/shared/infra';
import { AppModule } from './app/app.module';

/**
 * Accounting Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  await bootstrapService({
    module: AppModule,
    serviceName: 'accounting-service',
    port: Number(process.env.PORT) || 3022,
    swagger: {
      title: 'Accounting Service',
      description: 'The accounting service API description',
      version: '1.0',
    },
  });
}

bootstrap();
