/**
 * Global Exception Filter
 * 모든 예외를 표준 응답 포맷으로 변환
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponse } from './api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    this.logger.error(`Request ${request.method} ${request.url}`);

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const body = exceptionResponse as { message?: string | string[]; code?: string };
        message = Array.isArray(body.message) ? body.message[0] : (body.message || message);
        code = body.code || code;
      }
    } else if (exception instanceof Error) {
        message = exception.message;
        this.logger.error(`Unexpected error: ${exception.message}`, exception.stack);
    }

    const apiResponse = ApiResponse.error(message, code);

    response.status(status).json(apiResponse);
  }
}
