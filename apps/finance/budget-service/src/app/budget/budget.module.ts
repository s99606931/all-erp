import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BudgetController],
  providers: [BudgetService],
  exports: [BudgetService],
})
export class BudgetModule {}
