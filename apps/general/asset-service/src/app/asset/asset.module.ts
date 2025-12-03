import { Module } from '@nestjs/common';
import { PrismaModule } from '@all-erp/shared/infra';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AssetController],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
