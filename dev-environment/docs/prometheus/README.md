# Prometheus (ops-prometheus)

## 1. 서비스 역할 (Service Role)
**Prometheus**는 **시스템 모니터링 및 경고 툴킷**입니다.
- 시계열 데이터(Time Series Data) 수집 및 저장
- 각 서비스의 메트릭(CP, 메모리, 요청 수 등)을 주기적으로 수집(Scraping)합니다.

## 2. 정상 작동 확인 (Verification)

### 웹 접속
- 브라우저에서 접속: [http://localhost:9090](http://localhost:9090)

### 상태 확인
```bash
docker ps | grep ops-prometheus
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Port**: `9090`

### 웹 UI 사용법

#### Target 확인
1. **Status** > **Targets** 메뉴
2. 등록된 모든 수집 대상 확인
3. State가 "UP"이면 정상

#### 쿼리 실행
1. **Graph** 탭 클릭
2. 쿼리 입력 (예: `up`, `node_cpu_seconds_total`)
3. **Execute** 버튼 클릭
4. **Graph** 또는 **Console** 탭에서 결과 확인

### PromQL 기본 쿼리

#### 기본 메트릭 조회
```promql
# 서비스 상태 확인 (1=UP, 0=DOWN)
up

# 특정 job의 상태
up{job="node-exporter"}

# CPU 사용률
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# 메모리 사용률
(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100

# HTTP 요청 수 (최근 5분)
rate(http_requests_total[5m])
```

#### 집계 함수
```promql
# 합계
sum(http_requests_total)

# 평균
avg(node_cpu_seconds_total)

# 최댓값
max(http_request_duration_seconds)

# 그룹별 집계
sum by (status_code) (http_requests_total)
```

### 설정 파일 수정

#### prometheus.yml
`dev-environment/config/prometheus/prometheus.yml`

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  # Prometheus 자체 모니터링
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter (서버 메트릭)
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  # 애플리케이션 메트릭
  - job_name: 'auth-service'
    static_configs:
      - targets: ['erp-auth:3001']
    metrics_path: '/metrics'
```

#### 설정 적용
```bash
# Prometheus 재시작
docker restart ops-prometheus

# 설정 검증
curl http://localhost:9090/-/healthy
```

### 애플리케이션 메트릭 노출

#### Node.js (prom-client)
```javascript
const express = require('express');
const client = require('prom-client');

const app = express();

// 기본 메트릭 수집 활성화
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

// 커스텀 카운터
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// 커스텀 히스토그램
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// 미들웨어
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode }, duration);
  });
  
  next();
});

// 메트릭 엔드포인트
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3001);
```

#### Python (prometheus_client)
```python
from prometheus_client import Counter, Histogram, generate_latest, REGISTRY
from flask import Flask, Response

app = Flask(__name__)

# 커스텀 메트릭
http_requests_total = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

http_request_duration = Histogram(
    'http_request_duration_seconds',
    'HTTP request duration',
    ['method', 'endpoint']
)

@app.route('/metrics')
def metrics():
    return Response(generate_latest(REGISTRY), mimetype='text/plain')

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    duration = time.time() - request.start_time
    http_requests_total.labels(request.method, request.path, response.status_code).inc()
    http_request_duration.labels(request.method, request.path).observe(duration)
    return response
```

### Alert 설정

#### alert.rules.yml
```yaml
groups:
  - name: example_alerts
    rules:
      # 서비스 다운 알림
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"
          
      # 높은 CPU 사용률
      - alert: HighCPUUsage
        expr: 100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU usage on {{ $labels.instance }}"
```

### 문제 해결

#### 메트릭이 수집되지 않을 때
```bash
# Target 상태 확인
curl http://localhost:9090/api/v1/targets

# 설정 파일 검증
docker exec ops-prometheus promtool check config /etc/prometheus/prometheus.yml
```
