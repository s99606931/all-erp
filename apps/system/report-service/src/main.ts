/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

/**
 * Report Service 부트스트랩 함수
 * 보고서 생성 및 관리 서비스를 초기화하고 실행합니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정
  app.enableCors();

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('Report Service')
    .setDescription('보고서 생성 및 관리 API')
    .setVersion('1.0')
    .addTag('Reports')
    .addTag('Report Templates')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 서버 시작
  const port = Number(process.env.PORT) || 3060;
  await app.listen(port);

  console.log(`🚀 Report Service is running on: http://localhost:${port}`);
  console.log(`📝 Swagger documentation: http://localhost:${port}/api`);
}

bootstrap();
