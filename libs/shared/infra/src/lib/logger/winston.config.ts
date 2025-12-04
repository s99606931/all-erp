import * as winston from 'winston';
import { utilities as nestWinstonUtilities } from 'nest-winston';

export const winstonConfig = {
  level: process.env['NODE_ENV'] === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: process.env['SERVICE_NAME'] || 'all-erp' },
  transports: [
    // 콘솔 출력
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonUtilities.format.nestLike('AllERP', {
          colors: true,
          prettyPrint: true,
        })
      ),
    }),
    // 에러 로그 파일 (운영 환경)
    ...(process.env['NODE_ENV'] === 'production'
      ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
          }),
        ]
      : []),
  ],
};
