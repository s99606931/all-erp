import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';

import { winstonConfig } from '../logger/winston.config';

export interface BootstrapOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  module: any;
  globalPrefix?: string;
  port?: number;
  serviceName: string;
  swagger?: {
    title: string;
    description: string;
    version: string;
  };
}

/**
 * 공통 부트스트랩 함수
 * 모든 마이크로서비스의 초기화 로직을 표준화합니다.
 */
export async function bootstrapService(options: BootstrapOptions) {
  const { module, globalPrefix = 'api', port = 3000, serviceName, swagger } = options;

  // Winston Logger 설정
  const app = await NestFactory.create(module, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  const loggerService = app.get(LoggerService);

  // Global Prefix 설정
  app.setGlobalPrefix(globalPrefix);

  // ValidationPipe 전역 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Global Interceptors & Filters 설정
  app.useGlobalInterceptors(new LoggingInterceptor(loggerService));
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  // Swagger 설정
  if (swagger) {
    const config = new DocumentBuilder()
      .setTitle(swagger.title)
      .setDescription(swagger.description)
      .setVersion(swagger.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(globalPrefix, app, document);
  }

  // 포트 리스닝
  await app.listen(port);
  
  Logger.log(
    `🚀 [${serviceName}] Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  
  if (swagger) {
    Logger.log(
      `📚 [${serviceName}] Swagger is running on: http://localhost:${port}/${globalPrefix}`
    );
  }
}
