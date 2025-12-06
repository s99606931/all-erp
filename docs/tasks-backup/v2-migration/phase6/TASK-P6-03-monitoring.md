# TASK-P6-03: 모니터링 설정

## 📋 작업 개요
- **Phase**: Phase 6
- **예상 시간**: 1주
- **우선순위**: Medium
- **선행 작업**: TASK-P6-02

## 🎯 목표

Prometheus + Grafana + Jaeger를 이용한 모니터링 시스템 구축.

## 📝 상세 작업 내용

### 1. Prometheus 설정 (메트릭)

**docker-compose.monitoring.yml**:
```yaml
services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana
    ports:
      - "3030:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
```

### 2. Jaeger (분산 추적)

```yaml
  jaeger:
    image: jaegertracing/all-in-one
    ports:
      - "16686:16686"  # UI
      - "14268:14268"  # collector
```

### 3. 대시보드 구성

- API 응답 시간
- 서비스별 요청 수
- 에러율
- DB 연결 수
- RabbitMQ 큐 크기

## ✅ 완료 조건

- [ ] Prometheus + Grafana 설정
- [ ] Jaeger 분산 추적 설정
- [ ] 주요 메트릭 대시보드 생성
- [ ] 알람 규칙 설정

## 🔧 실행 명령어

```bash
docker compose -f docker-compose.monitoring.yml up -d

# Grafana
open http://localhost:3030

# Jaeger
open http://localhost:16686
```
