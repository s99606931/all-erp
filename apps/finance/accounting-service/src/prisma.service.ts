import { Injectable } from '@nestjs/common';
import { PrismaClient } from '.prisma/accounting-client';
import { PrismaServiceBase } from '@all-erp/shared/infra';

@Injectable()
export class PrismaService extends PrismaServiceBase {
  protected prismaClient: PrismaClient;

  constructor() {
    super('AccountingServicePrismaService');
    
    this.prismaClient = new PrismaClient({
      
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.prismaClient.$on('query' as never, (e: any) => {
        this.logger.debug(`Query: ${e.query} | Duration: ${e.duration}ms`);
      });
    }
  }

  get $queryRaw() {
    return this.prismaClient.$queryRaw.bind(this.prismaClient);
  }

  get $connect() {
    return this.prismaClient.$connect.bind(this.prismaClient);
  }

  get $disconnect() {
    return this.prismaClient.$disconnect.bind(this.prismaClient);
  }
}
