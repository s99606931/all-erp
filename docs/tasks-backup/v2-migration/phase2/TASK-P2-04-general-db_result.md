# TASK-P2-04: General 도메인 DB 연결 - 결과 보고서

## 📋 작업 요약

**작업 기간**: 2025-12-05  
**담당자**: AI Assistant  
**상태**: ✅ 완료

## 🎯 작업 목표

General 도메인(asset, supply, general-affairs 서비스)과 AI 서비스의 DB 연결을 신규 독립 DB로 전환하여 Database per Service 패턴을 구현합니다.

## ✅ 완료된 작업

### 1. Prisma 7 설정 파일 생성

각 서비스별로 독립적인 `prisma.config.ts` 파일을 생성하여 Prisma 7 호환성을 확보했습니다.

**apps/general/asset-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('ASSET_DATABASE_URL'),
  },
});
```

**apps/general/supply-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('SUPPLY_DATABASE_URL'),
  },
});
```

**apps/general/general-affairs-service/prisma.config.ts**:
```typescript
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: env('GENERAL_AFFAIRS_DATABASE_URL'),
  },
});
```

### 2. Prisma 스키마 수정 (Prisma 7 호환성)

각 서비스의 `schema.prisma`에서 `url` 라인을 제거하여 설정 파일 기반으로 전환했습니다.

**변경 전**:
```prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}
```

**변경 후**:
```prisma
datasource db {
    provider = "postgresql"
}
```

### 3. Prisma 마이그레이션 실행 및 한글화

각 서비스별로 독립 데이터베이스에 마이그레이션을 실행하고, 생성된 SQL 파일에 상세한 한국어 주석을 추가했습니다.

```bash
# asset-service (asset_db)
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/general/asset-service/prisma.config.ts

# supply-service (supply_db)
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/general/supply-service/prisma.config.ts

# general-affairs-service (general_affairs_db)
pnpm prisma migrate dev --name init --config=/data/all-erp/apps/general/general-affairs-service/prisma.config.ts
```

**마이그레이션 결과**:

✅ **asset_db** (asset-service):
- `assets`: 자산 정보
- `asset_history`: 자산 변동 이력
- `processed_events`, `outbox_events`

✅ **supply_db** (supply-service):
- `inventories`: 비품 재고
- `inventory_transactions`: 입출고 이력
- `processed_events`, `outbox_events`

✅ **general_affairs_db** (general-affairs-service):
- `vehicles`: 법인 차량 정보
- `vehicle_reservations`: 차량 예약 내역
- `processed_events`, `outbox_events`

### 4. Prisma Client 생성

```bash
cd apps/general/asset-service && pnpm prisma generate --config=prisma.config.ts
cd apps/general/supply-service && pnpm prisma generate --config=prisma.config.ts
cd apps/general/general-affairs-service && pnpm prisma generate --config=prisma.config.ts
```

### 5. AI 서비스 MongoDB 설정

AI 서비스는 MongoDB를 사용하며 `.env`를 통해 연결 정보를 구성했습니다.

**apps/ai/ai-service/.env**:
```bash
DATABASE_URL="mongodb://mongo:devpassword123@localhost:27017/ai_db"
```

## 📊 아키텍처 다이어그램

```mermaid
graph TB
    subgraph "General 도메인 서비스"
        direction TB
        ASSET["asset-service<br/>(Port: 3031)"]
        SUPPLY["supply-service<br/>(Port: 3032)"]
        GA["general-affairs-service<br/>(Port: 3033)"]
        AI["ai-service<br/>(Port: 3007)"]
    end
    
    subgraph "PostgreSQL 컨테이너"
        direction TB
        ASSET_DB["asset_db<br/>(assets)"]
        SUPPLY_DB["supply_db<br/>(inventories)"]
        GA_DB["general_affairs_db<br/>(vehicles)"]
    end
    
    subgraph "MongoDB 컨테이너"
        AI_DB[("ai_db<br/>(Documents)")]
    end
    
    ASSET -->|독립 연결| ASSET_DB
    SUPPLY -->|독립 연결| SUPPLY_DB
    GA -->|독립 연결| GA_DB
    AI -->|독립 연결| AI_DB
    
    style ASSET fill:#4682B4,stroke:#000,stroke-width:2px,color:#fff
    style SUPPLY fill:#2E8B57,stroke:#000,stroke-width:2px,color:#fff
    style GA fill:#DC143C,stroke:#000,stroke-width:2px,color:#fff
    style AI fill:#9370DB,stroke:#000,stroke-width:2px,color:#fff
```

## 🎓 Why This Matters (초급자를 위한 설명)

### 1. General 도메인의 서비스 분리 전략

General(총무/지원) 도메인은 성격이 다른 3가지 지원 업무를 독립적으로 처리합니다:

```mermaid
graph LR
    A["asset-service<br/>(자산 관리)"] --> B["고정자산<br/>감가상각"]
    C["supply-service<br/>(비품 관리)"] --> D["소모품<br/>재고/발주"]
    E["general-affairs<br/>(총무 서비스)"] --> F["법인차량<br/>예약/관리"]
    
    style A fill:#4682B4,stroke:#000,stroke-width:2px,color:#fff
    style C fill:#2E8B57,stroke:#000,stroke-width:2px,color:#fff
    style E fill:#DC143C,stroke:#000,stroke-width:2px,color:#fff
```

**왜 분리했나요?**

1.  **asset-service (자산 관리)**
    *   노트북, 책상, 서버 등 고정자산 관리
    *   감가상각 계산 (회계와 연동됨)
    *   자산 실사 및 이력 추적

2.  **supply-service (비품 관리)**
    *   A4용지, 볼펜 등 소모성 비품 관리
    *   재고 수량 추적 및 부족 시 알림
    *   입고/출고 트랜잭션 관리

3.  **general-affairs-service (총무 서비스)**
    *   공용 법인 차량 예약 및 배차
    *   시설물 관리 및 예약
    *   임직원 복리후생 지원

**장점**:
*   ✅ **특화된 로직**: 자산의 '감가상각'과 비품의 '재고관리'는 로직이 완전히 다릅니다. 이를 분리하여 복잡도를 낮춥니다.
*   ✅ **장애 격리**: 차량 예약 시스템이 멈춰도 비품 신청이나 자산 조회는 가능해야 합니다.

### 2. 실제 업무 시나리오 (차량 예약)

**시나리오: 법인 차량 예약 프로세스**

```mermaid
sequenceDiagram
    participant User as 임직원
    participant GA as general-affairs
    participant Notification as notification-service
    
    User->>GA: 1. 차량 예약 신청 (날짜, 목적)
    GA->>GA: 2. 예약 가능 여부 확인 (중복 체크)
    
    alt 예약 가능
        GA->>GA: 3. 예약 확정 (DB 저장)
        GA->>Notification: 4. reservation.confirmed 이벤트 발행
        Notification-->>User: 5. 예약 확정 알림톡 발송
    else 예약 불가
        GA-->>User: 3. 예약 실패 (이미 예약됨)
    end
```

### 3. AI 서비스 연동 예시

AI 서비스는 독립적인 MongoDB를 사용하여 비정형 데이터를 처리하고, 다른 서비스에 지능형 기능을 제공합니다.

**예시: 비품 구매 추천**
1.  **supply-service**: 지난 6개월간 A4용지 사용량 데이터 집계
2.  **ai-service**: 시계열 데이터를 분석하여 다음 달 예상 소요량 예측
3.  **결과**: "다음 주에 A4용지 50박스 주문이 필요할 것으로 예측됩니다." 알림 제공

## 📈 데이터베이스 검증 결과

### asset_db (자산)
```sql
postgres=# \c asset_db
asset_db=# \dt
             List of relations
 Schema |      Name       | Type  |  Owner   
--------+-----------------+-------+----------
 public | asset_history   | table | postgres
 public | assets          | table | postgres
 public | outbox_events   | table | postgres
 public | processed_events| table | postgres
```

### supply_db (비품)
```sql
postgres=# \c supply_db
supply_db=# \dt
              List of relations
 Schema |          Name          | Type  |  Owner   
--------+------------------------+-------+----------
 public | inventories            | table | postgres
 public | inventory_transactions | table | postgres
 public | outbox_events          | table | postgres
 public | processed_events       | table | postgres
```

### general_affairs_db (총무)
```sql
postgres=# \c general_affairs_db
general_affairs_db=# \dt
              List of relations
 Schema |         Name         | Type  |  Owner   
--------+----------------------+-------+----------
 public | outbox_events        | table | postgres
 public | processed_events     | table | postgres
 public | vehicle_reservations | table | postgres
 public | vehicles             | table | postgres
```

## 🔧 유용한 명령어

### Prisma 마이그레이션

```bash
# asset-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/general/asset-service/prisma.config.ts

# supply-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/general/supply-service/prisma.config.ts

# general-affairs-service
pnpm prisma migrate dev --name <migration_name> --config=/data/all-erp/apps/general/general-affairs-service/prisma.config.ts
```

### 데이터베이스 확인

```bash
# asset_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d asset_db -c "\dt"

# supply_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d supply_db -c "\dt"

# general_affairs_db 테이블 확인
docker exec all-erp-postgres psql -U postgres -d general_affairs_db -c "\dt"
```

## ✅ 완료 체크리스트

- [x] asset-service `prisma.config.ts` 생성
- [x] supply-service `prisma.config.ts` 생성
- [x] general-affairs-service `prisma.config.ts` 생성
- [x] 각 서비스 `schema.prisma`에서 `url` 제거
- [x] asset-service 마이그레이션 & 한글 주석 적용
- [x] supply-service 마이그레이션 & 한글 주석 적용
- [x] general-affairs-service 마이그레이션 & 한글 주석 적용
- [x] AI 서비스 MongoDB 연결 설정 확인
- [x] 각 DB 테이블 생성 확인

## 🎯 다음 단계

1. **TASK-P2-05**: Platform 도메인 DB 연결 (approval, report, notification, file)
2. **Phase 2 완료 보고**: 전체 마이그레이션 현황 종합

## 💡 베스트 프랙티스

### 1. 차량 예약 중복 방지 (general-affairs)

```typescript
// VehicleService
async function reserveVehicle(userId: string, vehicleId: string, startDate: Date, endDate: Date) {
  // 1. 해당 기간에 중복된 예약이 있는지 확인 (겹치는 기간 검색)
  // (start1 <= end2) and (end1 >= start2)
  const existingReservation = await db.vehicleReservation.findFirst({
    where: {
      vehicleId: vehicleId,
      status: 'CONFIRMED',
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } }
      ]
    }
  });

  if (existingReservation) {
    throw new BadRequestException('해당 시간에 이미 예약된 차량입니다.');
  }

  // 2. 예약 생성
  return await db.vehicleReservation.create({
    data: {
      vehicleId,
      userId,
      startDate,
      endDate,
      status: 'CONFIRMED'
    }
  });
}
```

### 2. 재고 부족 알림 (supply)

```typescript
// InventoryService
async function useItem(itemId: string, quantity: number) {
  return await db.$transaction(async (tx) => {
    // 1. 재고 차감
    const inventory = await tx.inventory.update({
      where: { id: itemId },
      data: { quantity: { decrement: quantity } }
    });

    if (inventory.quantity < 0) {
      throw new BadRequestException('재고가 부족합니다.');
    }

    // 2. 트랜잭션 기록
    await tx.inventoryTransaction.create({
      data: {
        inventoryId: itemId,
        type: 'OUT',
        quantity: quantity,
        date: new Date()
      }
    });

    // 3. 적정 재고 미만 시 알림 이벤트 발생
    if (inventory.quantity < inventory.minQuantity) {
      await eventBus.publish('supply.low_stock', {
        itemId: inventory.id,
        itemName: inventory.name,
        currentQuantity: inventory.quantity
      });
    }

    return inventory;
  });
}
```

## 🔐 보안 고려사항

1.  **자산 데이터 무결성**: 자산 취득/폐기 이력은 회계 감사 대상이므로 수정이 불가능하거나 엄격히 통제되어야 합니다 (`asset_history` 테이블 활용).
2.  **접근 권한**: 차량 예약이나 비품 신청은 일반 임직원도 가능하지만, 자산 등록이나 폐기는 재산 관리자만 가능해야 합니다 (RBAC 적용).
