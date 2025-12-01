import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

/**
 * Settlement Service 부트스트랩 함수
 * 애플리케이션을 초기화하고 실행합니다.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // API 전역 접두사 설정 (예: /api/...)
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // 전역 유효성 검사 파이프 설정
  // whitelist: DTO에 없는 속성 제거
  // transform: 페이로드를 DTO 인스턴스로 변환
  // forbidNonWhitelisted: DTO에 없는 속성이 있으면 에러 발생
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger API 문서 설정
  const config = new DocumentBuilder()
    .setTitle('Settlement Service')
    .setDescription('The settlement service API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 포트 설정 (기본값: 3023)
  const port = process.env.PORT || 3023;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
