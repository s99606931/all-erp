# etcd (erp-etcd)

## 1. 서비스 역할 (Service Role)
**etcd**는 **분산 키-값 저장소**로, 주로 설정 공유와 서비스 검색(Service Discovery)에 사용됩니다.
- 본 프로젝트에서는 **Milvus(벡터 DB)**의 메타데이터 저장소로 사용됩니다.
- 분산 시스템의 일관성 유지
- 설정 관리 및 분산 락(Distributed Lock) 구현

## 2. 정상 작동 확인 (Verification)

### 상태 확인
```bash
docker ps | grep erp-etcd
```

### 연결 테스트
```bash
docker exec erp-etcd etcdctl endpoint health
```

### 로그 확인
```bash
docker logs erp-etcd --tail 20
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Port**: `2379` (클라이언트 통신)
- **Endpoint**: `http://localhost:2379`

### etcdctl 기본 명령어

#### 키-값 저장 및 조회
```bash
# 값 저장
docker exec erp-etcd etcdctl put /config/app-name "my-application"
docker exec erp-etcd etcdctl put /config/database/host "localhost"
docker exec erp-etcd etcdctl put /config/database/port "5432"

# 값 조회
docker exec erp-etcd etcdctl get /config/app-name

# 특정 prefix의 모든 키 조회
docker exec erp-etcd etcdctl get /config/ --prefix

# 키와 값을 함께 보기 좋게 출력
docker exec erp-etcd etcdctl get /config/ --prefix --print-value-only=false
```

#### 키 삭제
```bash
# 단일 키 삭제
docker exec erp-etcd etcdctl del /config/app-name

# Prefix로 시작하는 모든 키 삭제
docker exec erp-etcd etcdctl del /config/ --prefix
```

#### Watch (변경 감지)
```bash
# 특정 키의 변경 감지
docker exec erp-etcd etcdctl watch /config/app-name

# Prefix로 시작하는 모든 키의 변경 감지
docker exec erp-etcd etcdctl watch /config/ --prefix
```

### 애플리케이션에서 사용하기

#### Node.js (etcd3)
```javascript
const { Etcd3 } = require('etcd3');

const client = new Etcd3({
  hosts: 'http://localhost:2379',
});

// 값 저장
await client.put('/config/api/timeout').value('5000');

// 값 조회
const timeout = await client.get('/config/api/timeout').string();
console.log('Timeout:', timeout);

// 여러 값 조회
const allConfig = await client.getAll().prefix('/config/').strings();
console.log('All Config:', allConfig);

// 값 변경 감지
const watcher = await client.watch().prefix('/config/').create();

watcher.on('put', (event) => {
  console.log('Config changed:', event.key.toString(), '->', event.value.toString());
});

// 분산 락 구현
const lease = client.lease(10);  // 10초 TTL
await lease.put('/locks/resource-1').value('locked');

// TTL이 있는 키 저장
await client.put('/sessions/user-123').value('active').lease(lease);
```

#### Python (python-etcd3)
```python
import etcd3

client = etcd3.client(host='localhost', port=2379)

# 값 저장
client.put('/config/api/timeout', '5000')

# 값 조회
value, metadata = client.get('/config/api/timeout')
print(f'Timeout: {value.decode()}')

# Prefix로 모든 값 조회
for value, metadata in client.get_prefix('/config/'):
    print(f'{metadata.key.decode()}: {value.decode()}')

# 값 변경 감지
events_iterator, cancel = client.watch_prefix('/config/')

for event in events_iterator:
    print(f'Event: {event}')
```

### 실전 예제: 동적 설정 관리

#### 설정 값 저장
```bash
# 데이터베이스 설정
docker exec erp-etcd etcdctl put /config/database/host "postgres"
docker exec erp-etcd etcdctl put /config/database/port "5432"
docker exec erp-etcd etcdctl put /config/database/name "erp"

# API 설정
docker exec erp-etcd etcdctl put /config/api/rate-limit "100"
docker exec erp-etcd etcdctl put /config/api/timeout "5000"
```

#### 애플리케이션에서 동적 설정 로드
```javascript
class ConfigManager {
  constructor() {
    this.client = new Etcd3({ hosts: 'http://localhost:2379' });
    this.config = {};
    this.loadConfig();
    this.watchConfig();
  }
  
  async loadConfig() {
    const configs = await this.client.getAll().prefix('/config/').strings();
    this.config = configs;
    console.log('Config loaded:', this.config);
  }
  
  async watchConfig() {
    const watcher = await this.client.watch().prefix('/config/').create();
    
    watcher.on('put', (event) => {
      const key = event.key.toString();
      const value = event.value.toString();
      this.config[key] = value;
      console.log('Config updated:', key, '=', value);
    });
  }
  
  get(key) {
    return this.config[`/config/${key}`];
  }
}

// 사용
const configManager = new ConfigManager();
const rateLimit = configManager.get('api/rate-limit');
```

### 서비스 디스커버리 (Service Discovery)

#### 서비스 등록
```javascript
// 서비스 시작 시 등록
const serviceName = 'auth-service';
const serviceInstance = 'auth-service-1';
const serviceEndpoint = 'http://localhost:3001';

const lease = client.lease(10);  // 10초 TTL with renewal

await client.put(`/services/${serviceName}/${serviceInstance}`)
  .value(JSON.stringify({ endpoint: serviceEndpoint, status: 'healthy' }))
  .lease(lease);

// Heartbeat로 lease 갱신
setInterval(() => {
  lease.keepaliveOnce();
}, 5000);
```

#### 서비스 발견
```javascript
// 특정 서비스의 모든 인스턴스 찾기
const instances = await client.getAll()
  .prefix(`/services/auth-service/`)
  .strings();

const endpoints = Object.values(instances).map(v => JSON.parse(v).endpoint);
console.log('Available auth-service endpoints:', endpoints);
```

### 데이터 관리
- 데이터는 `dev-environment/volumes/etcd`에 저장됩니다.

### 주의사항
- 직접 데이터를 수정하는 일은 드뭅니다. 주로 다른 시스템(Milvus 등)이 내부적으로 사용합니다.
- 본 프로젝트에서는 Milvus의 메타데이터 저장소로 사용되므로 함부로 데이터를 삭제하지 마세요.

### 문제 해결

#### 연결할 수 없을 때
```bash
# etcd가 실행 중인지 확인
docker exec erp-etcd etcdctl endpoint status

# 로그 확인
docker logs erp-etcd --tail 50
```
