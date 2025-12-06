import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateAssetDto } from './dto/asset.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AssetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAssetDto) {
    // 자산번호 자동 생성 (예: AST-001, AST-002)
    const count = await this.prisma.asset.count({ where: { tenantId: dto.tenantId } });
    const assetNumber = `AST-${String(count + 1).padStart(3, '0')}`;

    const asset = await this.prisma.asset.create({
      data: {
        tenantId: dto.tenantId,
        assetNumber,
        name: dto.name,
        category: dto.category,
        acquisitionDate: new Date(dto.acquisitionDate),
        acquisitionValue: new Prisma.Decimal(dto.acquisitionValue),
        currentValue: new Prisma.Decimal(dto.acquisitionValue),
      },
    });

    // 이력 기록
    await this.prisma.assetHistory.create({
      data: {
        assetId: asset.id,
        changeType: 'ACQUIRED',
        description: `Asset acquired: ${asset.name}`,
      },
    });

    return asset;
  }

  async findAll(tenantId: string) {
    return this.prisma.asset.findMany({
      where: { tenantId },
      include: { history: true },
    });
  }

  async depreciate(id: string, years: number) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new Error('Asset not found');

    // 정액법 감가상각: (취득가액 - 잔존가액) / 내용년수
    const residualValue = asset.acquisitionValue.mul(0.1); // 잔존가액 10%
    const depreciationPerYear = asset.acquisitionValue.sub(residualValue).div(years);
    const newValue = asset.currentValue.sub(depreciationPerYear);

    const updated = await this.prisma.asset.update({
      where: { id },
      data: { currentValue: newValue.greaterThan(residualValue) ? newValue : residualValue },
    });

    await this.prisma.assetHistory.create({
      data: {
        assetId: id,
        changeType: 'DEPRECIATED',
        description: `Depreciated by ${depreciationPerYear.toFixed(2)}`,
      },
    });

    return updated;
  }
}
