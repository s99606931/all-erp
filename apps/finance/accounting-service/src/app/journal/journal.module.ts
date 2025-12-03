import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { JournalService } from './journal.service';
import { JournalController } from './journal.controller';

@Module({
  imports: [PrismaModule],
  controllers: [JournalController],
  providers: [JournalService],
  exports: [JournalService],
})
export class JournalModule {}
