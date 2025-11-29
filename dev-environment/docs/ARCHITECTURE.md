# ALL-ERP 시스템 아키텍처

## 전체 시스템 구성도

```mermaid
graph TB
    subgraph "외부 사용자"
        USER[웹 브라우저/모바일 앱]
    end
    
    subgraph "API Gateway & Load Balancing"
        NGINX[Nginx Gateway<br/>:80, :443]
    end
    
    subgraph "애플리케이션 서비스"
        AUTH[Auth Service<br/>:3001]
        SYSTEM[System Service<br/>:3002]
        WEB[Web Admin<br/>:4200]
    end
    
    subgraph "데이터베이스 레이어"
        PG[(PostgreSQL<br/>:5432)]
        REDIS[(Redis<br/>:6379)]
        MILVUS[(Milvus<br/>:19530)]
    end
    
    subgraph "메시징 & 이벤트"
        RABBIT[RabbitMQ<br/>:5672, :15672]
    end
    
    subgraph "파일 저장소"
        MINIO[MinIO<br/>:9000, :9001]
    end
    
    subgraph "서비스 디스커버리 & 설정"
        ETCD[etcd<br/>:2379]
    end
    
    subgraph "모니터링 & 로깅"
        PROM[Prometheus<br/>:9090]
        GRAFANA[Grafana<br/>:3000]
        ES[Elasticsearch<br/>:9200]
        KIBANA[Kibana<br/>:5601]
        LOGSTASH[Logstash<br/>:5044]
        JAEGER[Jaeger<br/>:16686]
    end
    
    subgraph "DevOps"
        GITLAB[GitLab<br/>:8980]
    end
    
    USER -->|HTTP/HTTPS| NGINX
    NGINX -->|/api/*| AUTH
    NGINX -->|/api/*| SYSTEM
    NGINX -->|/*| WEB
    
    AUTH --> PG
    AUTH --> REDIS
    AUTH --> RABBIT
    SYSTEM --> PG
    SYSTEM --> REDIS
    SYSTEM --> RABBIT
    
    AUTH -.->|파일 업로드| MINIO
    SYSTEM -.->|파일 업로드| MINIO
    
    AUTH -.->|벡터 검색| MILVUS
    SYSTEM -.->|벡터 검색| MILVUS
    
    MILVUS --> ETCD
    MILVUS --> MINIO
    
    AUTH -.->|메트릭| PROM
    SYSTEM -.->|메트릭| PROM
    NGINX -.->|메트릭| PROM
    
    AUTH -.->|로그| LOGSTASH
    SYSTEM -.->|로그| LOGSTASH
    LOGSTASH --> ES
    ES --> KIBANA
    
    AUTH -.->|트레이스| JAEGER
    SYSTEM -.->|트레이스| JAEGER
    
    PROM --> GRAFANA
    
    GITLAB -.->|CI/CD 배포| AUTH
    GITLAB -.->|CI/CD 배포| SYSTEM
    
 
```

## 서비스 역할별 분류

### 🎯 API Gateway
- **Nginx**: 외부 요청을 내부 서비스로 라우팅

### 💼 애플리케이션 서비스
- **Auth Service**: 인증/인가 처리
- **System Service**: 시스템 관리
- **Web Admin**: 관리자 웹 인터페이스

### 💾 데이터 저장소
- **PostgreSQL**: 메인 관계형 데이터베이스
- **Redis**: 캐시 및 세션 저장소
- **Milvus**: 벡터 데이터베이스 (AI/ML)

### 📨 메시징
- **RabbitMQ**: 서비스 간 비동기 메시지 전달

### 📁 파일 저장소
- **MinIO**: S3 호환 객체 스토리지

### ⚙️ 인프라 지원
- **etcd**: 서비스 디스커버리 및 설정 관리 (Milvus 의존성)

### 📊 모니터링 & 로깅
- **Prometheus**: 메트릭 수집
- **Grafana**: 메트릭 시각화
- **Elasticsearch**: 로그 저장 및 검색
- **Kibana**: 로그 시각화
- **Logstash**: 로그 수집 파이프라인
- **Jaeger**: 분산 트레이싱

### 🔧 DevOps
- **GitLab**: 소스 코드 관리 및 CI/CD

## 데이터 흐름 예시

### 1. 사용자 로그인 플로우
```mermaid
sequenceDiagram
    participant U as 사용자
    participant N as Nginx
    participant A as Auth Service
    participant P as PostgreSQL
    participant R as Redis
    
    U->>N: POST /api/auth/login
    N->>A: 요청 전달
    A->>P: 사용자 조회
    P-->>A: 사용자 정보
    A->>R: 세션 저장
    R-->>A: OK
    A-->>N: JWT 토큰
    N-->>U: 로그인 성공
```

### 2. 파일 업로드 플로우
```mermaid
sequenceDiagram
    participant U as 사용자
    participant A as Auth Service
    participant M as MinIO
    participant P as PostgreSQL
    
    U->>A: 파일 업로드 요청
    A->>M: 파일 저장
    M-->>A: 파일 URL
    A->>P: 파일 메타데이터 저장
    P-->>A: OK
    A-->>U: 업로드 완료
```

### 3. 비동기 작업 플로우
```mermaid
sequenceDiagram
    participant A as Auth Service
    participant RQ as RabbitMQ
    participant W as Worker Service
    participant P as PostgreSQL
    
    A->>RQ: 이메일 발송 요청
    RQ-->>A: ACK
    A-->>A: 즉시 응답
    RQ->>W: 메시지 전달
    W->>W: 이메일 발송
    W->>P: 발송 기록 저장
```

## 위치별 파일 경로
- 각 서비스별 상세 문서: `dev-environment/docs/<서비스명>/README.md`
- Docker 설정: `dev-environment/docker-compose.yml`
- 서비스 시작: `./dev-environment/start-dev.sh`
