import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from './business.exception';
import { ApiResponse } from './api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof BusinessException) {
      status = exception.getStatus();
      const errResponse = exception.getResponse() as any;
      message = errResponse.message || exception.message;
      code = errResponse.code || 'BUSINESS_ERROR';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errResponse = exception.getResponse();
      message = exception.message;
      if (typeof errResponse === 'object' && errResponse !== null) {
          code = (errResponse as any).code || `HTTP_${status}`;
      } else {
          code = `HTTP_${status}`;
      }
    } else {
      this.logger.error(exception);
    }

    const responseBody = ApiResponse.error(message, code);

    response
      .status(status)
      .json(responseBody);
  }
}
