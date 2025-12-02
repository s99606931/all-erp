/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * AI Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // API 전역 접두사 설정 (예: /api/...)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 전역 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger API 문서 설정
  const config = new DocumentBuilder()
    .setTitle('AI Service')
    .setDescription('AI 기능 및 LLM 연동 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  // 포트 설정 (기본값: 3007)
  const port = process.env.PORT || 3007;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
