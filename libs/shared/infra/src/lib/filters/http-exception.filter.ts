import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const body = exceptionResponse as { message?: string | string[]; code?: string };
        message = Array.isArray(body.message) ? body.message[0] : (body.message || message);
      }
    } else if (exception instanceof Error) {
        message = exception.message;
        // 500 에러만 로깅 (의도된 4xx 에러는 경고 수준으로 줄이거나 생략 가능)
        if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(`Unexpected error: ${exception.message}`, exception.stack, 'GlobalExceptionFilter');
        }
    }

    const errorResponse = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      traceId: request.headers['x-trace-id'] || 'unknown',
    };

    response.status(status).json(errorResponse);
  }
}
