#!/bin/bash

# 모든 prisma.service.ts 파일을 올바른 형식으로 수정하는 스크립트

set -e

WORKSPACE_ROOT="/data/all-erp"

# 수정이 필요한 서비스 목록
SERVICES=(
  "system/system-service"
  "system/tenant-service"
  "hr/personnel-service"
  "hr/payroll-service"
  "hr/attendance-service"
  "finance/budget-service"
  "finance/accounting-service"
  "finance/settlement-service"
  "general/asset-service"
  "general/supply-service"
  "general/general-affairs-service"
  "platform/approval-service"
  "platform/report-service"
  "platform/file-service"
  "platform/notification-service"
)

for service_path in "${SERVICES[@]}"; do
  service_name=$(basename "$service_path")
  service_dir="$WORKSPACE_ROOT/apps/$service_path"
  prisma_service_file="$service_dir/src/prisma.service.ts"
  
  if [ ! -f "$prisma_service_file" ]; then
    echo "⚠️  파일 없음: $service_name"
    continue
  fi
  
  echo "🔧 수정 중: $service_name"
  
  # 올바른 내용으로 재작성
  cat > "$prisma_service_file" << 'EOF'
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaServiceBase } from '@all-erp/shared/infra';

@Injectable()
export class PrismaService extends PrismaServiceBase {
  protected prismaClient: PrismaClient;

  constructor() {
    super('SERVICE_NAMEPrismaService');
    
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
EOF

  # 서비스명으로 치환 (PascalCase)
  service_pascal=$(echo "$service_name" | sed 's/-\([a-z]\)/\U\1/g' | sed 's/^\([a-z]\)/\U\1/')
  sed -i "s/SERVICE_NAME/${service_pascal}/g" "$prisma_service_file"
  
  echo "✅ $service_name 완료"
done

echo ""
echo "🎉 모든 서비스 수정 완료!"
