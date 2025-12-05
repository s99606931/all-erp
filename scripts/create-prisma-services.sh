#!/bin/bash

# 서비스별 독립 PrismaService 생성 스크립트
# 나머지 15개 마이크로서비스에 독립 PrismaService와 PrismaModule을 생성합니다.

set -e

WORKSPACE_ROOT="/data/all-erp"

# 서비스 정의 (도메인/서비스명/모델명들)
declare -A SERVICES=(
  ["system/system-service"]="department,commonCode"
  ["system/tenant-service"]="tenant"
  ["hr/personnel-service"]="employee"
  ["hr/payroll-service"]="payroll,payrollItem"
  ["hr/attendance-service"]="attendance,leaveRequest"
  ["finance/budget-service"]="budget"
  ["finance/accounting-service"]="chartOfAccounts,journalEntry,journalEntryLine"
  ["finance/settlement-service"]="processedEvent,outboxEvent"
  ["general/asset-service"]="asset,assetHistory"
  ["general/supply-service"]="inventory,inventoryTransaction"
  ["general/general-affairs-service"]="vehicle,vehicleReservation"
  ["platform/approval-service"]=""
  ["platform/report-service"]=""
  ["platform/file-service"]=""
  ["platform/notification-service"]="notification"
)

for service_path in "${!SERVICES[@]}"; do
  service_name=$(basename "$service_path")
  service_dir="$WORKSPACE_ROOT/apps/$service_path"
  
  echo "🔧 Processing: $service_name"
  
  # 1. PrismaService 생성
  cat > "$service_dir/src/prisma.service.ts" << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaServiceBase } from '@all-erp/shared/infra';

@Injectable()
export class PrismaService extends PrismaServiceBase {
  protected prismaClient: PrismaClient;

  constructor() {
    super('SERVICE_NAMEPrismaService');
    
    this.prismaClient = new PrismaClient({
      datasourceUrl: process.env['DATABASE_URL'],
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
    });

    if (process.env['NODE_ENV'] !== 'production') {
      this.prismaClient.$on('query' as never, (e: any) => {
        this.logger.debug(\`Query: \${e.query} | Duration: \${e.duration}ms\`);
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
EOF

  # 서비스명으로 치환
  sed -i "s/SERVICE_NAME/$(echo $service_name | sed 's/-//g' | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')/g" "$service_dir/src/prisma.service.ts"

  # 2. PrismaModule 생성
  cat > "$service_dir/src/prisma.module.ts" << 'EOF'
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

  # 3. AppModule 업데이트
  if [ -f "$service_dir/src/app/app.module.ts" ]; then
    # SharedInfraModule import 제거
    sed -i "/import.*SharedInfraModule.*from.*@all-erp\/shared\/infra/d" "$service_dir/src/app/app.module.ts"
    
    # PrismaModule import 추가 (AuthModule import 다음 줄에)
    sed -i "/import.*AuthModule\|import.*from.*\.\/.*\.module';$/a import { PrismaModule } from '../prisma.module';" "$service_dir/src/app/app.module.ts"
    
    # imports 배열에서 SharedInfraModule을 PrismaModule로 교체
    sed -i "s/SharedInfraModule/PrismaModule/g" "$service_dir/src/app/app.module.ts"
  fi
  
  echo "✅ $service_name 완료"
done

echo ""
echo "🎉 모든 서비스 리팩토링 완료!"
