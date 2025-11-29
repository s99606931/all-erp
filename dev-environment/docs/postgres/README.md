# PostgreSQL (erp-postgres)

## 1. 서비스 역할 (Service Role)
**PostgreSQL**은 본 프로젝트의 **메인 관계형 데이터베이스(RDBMS)**입니다.
- 사용자 정보, 게시글, 주문 데이터 등 구조화된 핵심 데이터를 저장합니다.
- `auth-service` 등 주요 마이크로서비스가 이 데이터베이스를 사용합니다.

### 아키텍처 다이어그램

```mermaid
graph TB
    subgraph "애플리케이션 서비스"
        AUTH[Auth Service]
        SYSTEM[System Service]
        OTHER[Other Services]
    end
    
    subgraph "PostgreSQL"
        PG[(PostgreSQL<br/>Database)]
        
        subgraph "데이터베이스"
            DB_ERP[erp DB]
        end
        
        subgraph "주요 테이블"
            USERS[users]
            POSTS[posts]
            ORDERS[orders]
        end
    end
    
    subgraph "백업"
        BACKUP[pg_dump<br/>백업 파일]
    end
    
    AUTH -->|SQL 쿼리| PG
    SYSTEM -->|SQL 쿼리| PG
    OTHER -->|SQL 쿼리| PG
    
    PG --> DB_ERP
    DB_ERP --> USERS
    DB_ERP --> POSTS
    DB_ERP --> ORDERS
    
    PG -.->|백업| BACKUP
    BACKUP -.->|복원| PG
    
    style PG fill:#336791,color:#fff
    style AUTH fill:#fff4e1
    style SYSTEM fill:#fff4e1
    style DB_ERP fill:#e8f5e9
```

### 데이터 흐름

```mermaid
sequenceDiagram
    participant App as 애플리케이션
    participant PG as PostgreSQL
    participant Disk as 디스크
    
    App->>PG: INSERT/UPDATE 쿼리
    PG->>Disk: 데이터 저장
    Disk-->>PG: 저장 완료
    PG-->>App: 응답
    
    App->>PG: SELECT 쿼리
    PG->>Disk: 데이터 조회
    Disk-->>PG: 데이터 반환
    PG-->>App: 결과 반환
```


## 2. 정상 작동 확인 (Verification)

### 상태 확인
```bash
docker ps | grep erp-postgres
# 결과에 (healthy) 또는 Up 상태여야 함
```

### 접속 테스트
```bash
# 컨테이너 내부 접속
docker exec -it erp-postgres psql -U postgres -d erp

# 접속 성공 시 프롬프트가 아래와 같이 변경됨
# erp=# 
```

### 로그 확인
```bash
docker logs erp-postgres --tail 20
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Host**: `localhost` (외부), `postgres` (컨테이너 내부)
- **Port**: `5432`
- **User**: `postgres`
- **Password**: `postgres` (기본값, `.env` 참조)
- **Database**: `erp`

### 기본 데이터베이스 작업

#### 데이터베이스 목록 확인
```bash
docker exec -it erp-postgres psql -U postgres -c "\l"
```

#### 테이블 목록 확인
```bash
docker exec -it erp-postgres psql -U postgres -d erp -c "\dt"
```

#### SQL 쿼리 실행
```bash
# 직접 쿼리 실행
docker exec -it erp-postgres psql -U postgres -d erp -c "SELECT * FROM users LIMIT 5;"
```

### 애플리케이션에서 연결하기

#### Node.js (Prisma)
```typescript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erp"
```

#### Node.js (pg 라이브러리)
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'erp',
});

// 쿼리 실행
const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
```

#### Python (psycopg2)
```python
import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="erp",
    user="postgres",
    password="postgres"
)

cursor = conn.cursor()
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
rows = cursor.fetchall()
```

### 백업 및 복원

#### 데이터베이스 백업
```bash
docker exec erp-postgres pg_dump -U postgres erp > backup_$(date +%Y%m%d).sql
```

#### 데이터베이스 복원
```bash
cat backup_20231130.sql | docker exec -i erp-postgres psql -U postgres erp
```

### 유용한 SQL 명령어

#### 사용자 관리
```sql
-- 새 사용자 생성
CREATE USER myapp WITH PASSWORD 'mypassword';

-- 데이터베이스 권한 부여
GRANT ALL PRIVILEGES ON DATABASE erp TO myapp;
```

#### 테이블 생성 예시
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 데이터 관리
- 데이터는 `dev-environment/volumes/postgres`에 영구 저장됩니다.
- 초기화가 필요하면 `docker compose --profile all down -v` 후 다시 시작하세요. (주의: 모든 데이터가 삭제됩니다)

### 문제 해결

#### 컨테이너가 시작되지 않을 때
```bash
# 로그 확인
docker logs erp-postgres

# 볼륨 권한 확인
ls -ld /data/allsharp/dev-environment/volumes/postgres
```

#### 연결이 거부될 때
```bash
# PostgreSQL이 실행 중인지 확인
docker exec erp-postgres pg_isready -U postgres
```
