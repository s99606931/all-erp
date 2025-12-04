# TASK-P1-03: 데이터 마이그레이션 스크립트

## 📋 작업 개요
- **Phase**: Phase 1 (Database 분리)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P1-02 (Prisma 스키마 분리 완료)

## 🎯 목표

기존 단일 데이터베이스의 데이터를 17개의 독립적인 서비스 DB로 안전하게 마이그레이션합니다.

## 📝 상세 작업 내용

### 1. 마이그레이션 전략

**원칙**:
- Zero Downtime 마이그레이션 (Blue-Green 방식)
- 데이터 일관성 보장
- 롤백 가능한 마이그레이션

**단계**:
1. 기존 DB 스냅샷 백업
2. 신규 DB에 스키마 생성
3. 데이터 복사
4. 데이터 검증
5. 서비스 전환

### 2. 백업 스크립트

**scripts/migration/backup-db.sh**:
```bash
#!/bin/bash

# 현재 날짜
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups/$DATE"

mkdir -p $BACKUP_DIR

# PostgreSQL 백업
docker exec postgres pg_dump -U postgres erp_db > $BACKUP_DIR/erp_db_backup.sql

echo "백업 완료: $BACKUP_DIR"
```

### 3. 마이그레이션 스크립트 (per Service)

**scripts/migration/migrate-auth-service.ts**:
```typescript
import { PrismaClient as OldPrisma } from '@prisma/client-old';
import { PrismaClient as NewPrisma } from '@auth-service/prisma/client';

async function migrateAuthData() {
  const oldDb = new OldPrisma();
  const newDb = new NewPrisma();

  try {
    // 1. users 테이블 마이그레이션
    const users = await oldDb.user.findMany();
    
    for (const user of users) {
      await newDb.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          isActive: user.isActive,
          tenantId: user.tenantId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          deletedAt: user.deletedAt,
        },
      });
    }

    console.log(`✅ ${users.length}명의 사용자 마이그레이션 완료`);

    // 2. roles 테이블 마이그레이션
    const roles = await oldDb.role.findMany();
    
    for (const role of roles) {
      await newDb.role.create({
        data: {
          id: role.id,
          name: role.name,
          description: role.description,
          tenantId: role.tenantId,
          createdAt: role.createdAt,
        },
      });
    }

    console.log(`✅ ${roles.length}개의 역할 마이그레이션 완료`);

    // 3. user_roles 테이블 마이그레이션
    const userRoles = await oldDb.userRole.findMany();
    
    for (const ur of userRoles) {
      await newDb.userRole.create({
        data: {
          userId: ur.userId,
          roleId: ur.roleId,
          tenantId: ur.tenantId,
        },
      });
    }

    console.log(`✅ ${userRoles.length}개의 사용자-역할 마이그레이션 완료`);

  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

migrateAuthData();
```

### 4. 데이터 검증 스크립트

**scripts/migration/validate-auth-data.ts**:
```typescript
import { PrismaClient as OldPrisma } from '@prisma/client-old';
import { PrismaClient as NewPrisma } from '@auth-service/prisma/client';

async function validateAuthData() {
  const oldDb = new OldPrisma();
  const newDb = new NewPrisma();

  try {
    // 사용자 수 비교
    const oldUserCount = await oldDb.user.count();
    const newUserCount = await newDb.user.count();

    if (oldUserCount !== newUserCount) {
      throw new Error(`사용자 수 불일치: Old=${oldUserCount}, New=${newUserCount}`);
    }

    console.log(`✅ 사용자 수 검증 통과: ${oldUserCount}`);

    // 역할 수 비교
    const oldRoleCount = await oldDb.role.count();
    const newRoleCount = await newDb.role.count();

    if (oldRoleCount !== newRoleCount) {
      throw new Error(`역할 수 불일치: Old=${oldRoleCount}, New=${newRoleCount}`);
    }

    console.log(`✅ 역할 수 검증 통과: ${oldRoleCount}`);

    // 샘플 데이터 비교
    const oldSample = await oldDb.user.findFirst({ where: { id: 1 } });
    const newSample = await newDb.user.findFirst({ where: { id: 1 } });

    if (oldSample?.email !== newSample?.email) {
      throw new Error('샘플 데이터 불일치');
    }

    console.log(`✅ 샘플 데이터 검증 통과`);

  } finally {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  }
}

validateAuthData();
```

### 5. 전체 마이그레이션 오케스트레이션

**scripts/migration/run-all-migrations.sh**:
```bash
#!/bin/bash

set -e  # 에러 발생 시 즉시 중단

echo "🚀 마이그레이션 시작"

# 1. 백업
echo "1️⃣ 기존 DB 백업 중..."
./scripts/migration/backup-db.sh

# 2. 신규 DB 스키마 생성
echo "2️⃣ 신규 DB 스키마 생성 중..."
cd apps/system/auth-service && pnpm prisma migrate deploy && cd ../../..
cd apps/system/system-service && pnpm prisma migrate deploy && cd ../../..
# ... 모든 서비스에 대해 반복

# 3. 데이터 마이그레이션
echo "3️⃣ 데이터 마이그레이션 중..."
ts-node scripts/migration/migrate-auth-service.ts
ts-node scripts/migration/migrate-personnel-service.ts
# ... 모든 서비스에 대해 반복

# 4. 데이터 검증
echo "4️⃣ 데이터 검증 중..."
ts-node scripts/migration/validate-auth-data.ts
ts-node scripts/migration/validate-personnel-data.ts
# ... 모든 서비스에 대해 반복

echo "✅ 마이그레이션 완료"
```

### 6. 롤백 스크립트

**scripts/migration/rollback.sh**:
```bash
#!/bin/bash

BACKUP_DIR=$1

if [ -z "$BACKUP_DIR" ]; then
  echo "사용법: ./rollback.sh <백업_디렉토리>"
  exit 1
fi

echo "🔄 롤백 시작: $BACKUP_DIR"

# PostgreSQL 복원
docker exec -i postgres psql -U postgres erp_db < $BACKUP_DIR/erp_db_backup.sql

echo "✅ 롤백 완료"
```

## ✅ 완료 조건

- [ ] 17개 서비스별 마이그레이션 스크립트 작성
- [ ] 17개 서비스별 검증 스크립트 작성
- [ ] 백업 스크립트 테스트
- [ ] 마이그레이션 오케스트레이션 스크립트 작성
- [ ] 롤백 스크립트 테스트
- [ ] 테스트 환경에서 마이그레이션 성공
- [ ] 마이그레이션 문서화 (`docs/guides/data-migration.md`)

## 🔧 실행 명령어

```bash
# 백업
./scripts/migration/backup-db.sh

# 마이그레이션 실행
./scripts/migration/run-all-migrations.sh

# 롤백 (필요시)
./scripts/migration/rollback.sh ./backups/20250104_153000
```

## 📚 참고 문서

- [Prisma Migrate](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 🚨 주의사항

- **반드시 백업 먼저!**
- 마이그레이션 전 서비스 중단 필요
- 트랜잭션을 사용하여 원자성 보장
- 외래키 관계는 ID 값만 복사 (참조 무결성은 애플리케이션 레벨에서 관리)
- 대용량 데이터는 배치 처리 (1000건씩)
