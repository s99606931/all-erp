# TASK-P6-02: 성능 최적화

## 📋 작업 개요
- **Phase**: Phase 6 (통합 테스트 및 최적화)
- **예상 시간**: 1주
- **우선순위**: High
- **선행 작업**: TASK-P6-01

## 🎯 목표

시스템 전체 성능 최적화 및 병목 지점 개선.

## 📝 상세 작업 내용

### 1. API 응답 시간 최적화

**목표**: 평균 500ms 이하

- DB 쿼리 최적화 (N+1 제거)
- Redis 캐싱 적용
- Connection Pool 튜닝
- API Gateway 도입

### 2. 프론트엔드 최적화

- Code Splitting
- Lazy Loading
- Memoization (React.memo, useMemo)
- Virtual Scrolling (대용량 리스트)

### 3. DB 인덱스 최적화

```sql
-- 자주 조회되는 컬럼에 인덱스 추가
CREATE INDEX idx_users_tenant_email ON users(tenant_id, email);
CREATE INDEX idx_employees_dept ON employees(department_id);
```

## ✅ 완료 조건

- [ ] API 응답 시간 평균 500ms 이하
- [ ] 프론트엔드 First Contentful Paint 2초 이내
- [ ] DB 슬로우 쿼리 0개
- [ ] Lighthouse 스코어 90 이상

## 🔧 실행 명령어

```bash
# 성능 테스트
k6 run tests/load/api-performance.js

# Lighthouse 실행
lighthouse http://localhost:3000
```

## 📚 참고 문서

- [성능 최적화 가이드](https://web.dev/performance/)
