import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { PayrollCalculator } from './payroll.calculator';

@Module({
  imports: [PrismaModule],
  controllers: [PayrollController],
  providers: [PayrollService, PayrollCalculator],
  exports: [PayrollService],
})
export class PayrollModule {}
