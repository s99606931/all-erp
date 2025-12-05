import { Module } from '@nestjs/common';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { ApprovalPrismaService } from '../../prisma/approval-prisma.service';

@Module({
  controllers: [ApprovalController],
  providers: [ApprovalPrismaService, ApprovalService],
  exports: [ApprovalService],
})
export class ApprovalModule {}
