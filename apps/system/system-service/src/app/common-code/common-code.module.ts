import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { CommonCodeService } from './common-code.service';
import { CommonCodeController } from './common-code.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CommonCodeController],
  providers: [CommonCodeService],
  exports: [CommonCodeService],
})
export class CommonCodeModule {}
