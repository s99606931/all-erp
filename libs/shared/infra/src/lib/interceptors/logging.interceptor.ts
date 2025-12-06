import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const { method, url } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const response = ctx.getResponse();
          const statusCode = response.statusCode;
          const duration = Date.now() - now;

          this.logger.logHttpRequest(method, url, statusCode, duration, {
            userAgent,
            ip,
          });
        },
        error: (err) => {
          const duration = Date.now() - now;
          const statusCode = err.status || 500;
          
          this.logger.logHttpRequest(method, url, statusCode, duration, {
            userAgent,
            ip,
            error: err.message,
          });
        },
      })
    );
  }
}
