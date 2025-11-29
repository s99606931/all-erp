# Jaeger (ops-jaeger)

## 1. 서비스 역할 (Service Role)
**Jaeger**는 **분산 트레이싱 시스템**입니다.
- 마이크로서비스 간의 요청 흐름을 추적합니다.
- 요청이 어떤 서비스를 거쳐 처리되었는지, 어디서 시간이 오래 걸렸는지 분석하여 병목 구간을 찾습니다.

## 2. 정상 작동 확인 (Verification)

### 웹 접속
-브라우저에서 접속: [http://localhost:16686](http://localhost:16686)

### 상태 확인
```bash
docker ps | grep ops-jaeger
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Query Port**: `16686` (웹 UI)
- **Collector Port**: `14268` (HTTP), `14250` (gRPC)

### 웹 UI 사용법

#### 트레이스 조회
1. 웹 UI 접속
2. **Service** 드롭다운에서 서비스 선택
3. **Find Traces** 버튼 클릭
4. 트레이스 목록에서 특정 트레이스 클릭하여 상세 확인

### 애플리케이션 연동 (OpenTelemetry)

#### Node.js
```javascript
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { JaegerExporterconst = require('@opentelemetry/exporter-jaeger');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');

const provider = new NodeTracerProvider();

provider.addSpanProcessor(
  new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://localhost:14268/api/traces',
    })
  )
);

provider.register();

registerInstrumentations({
  instrumentations: [new HttpInstrumentation()],
});
```

### 트레이스 확인
- 웹 UI에서 **Service**를 선택하고 **Find Traces** 버튼을 클릭하여 요청 기록을 조회합니다.
