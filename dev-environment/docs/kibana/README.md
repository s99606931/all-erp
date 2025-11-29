# Kibana (ops-kibana)

## 1. 서비스 역할 (Service Role)
**Kibana**는 **Elasticsearch 데이터 시각화 대시보드**입니다.
- 수집된 로그를 검색하고 그래프나 차트로 시각화합니다.
- 시스템 모니터링 및 문제 해결에 사용됩니다.

## 2. 정상 작동 확인 (Verification)

### 웹 접속
- 브라우저에서 접속: [http://localhost:5601](http://localhost:5601)

### 상태 확인
```bash
docker ps | grep ops-kibana
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Port**: `5601`

### 기본 사용법

#### 1. Index Pattern 생성
1. **Management** > **Stack Management** > **Index Patterns**
2. **Create index pattern** 클릭
3. Index pattern: `logs-*` 입력
4. **Next step** 클릭
5. Time field: `@timestamp` 선택
6. **Create index pattern** 클릭

#### 2. 데이터 검색 (Discover)
1. **Discover** 메뉴 클릭
2. Index pattern 선택
3. 검색 쿼리 입력 (예: `level:ERROR`)
4. 시간 범위 선택

#### 3. 시각화 생성 (Visualize)
1. **Visualize** > **Create visualization**
2. 시각화 타입 선택 (Line, Bar, Pie 등)
3. 데이터 소스 선택
4. 집계 설정
5. **Save** 클릭

### 주요 기능
- **Discover**: 로그 데이터 검색 및 탐색
- **Dashboard**: 시각화 도구 모음
- **Management**: 인덱스 패턴 설정 등
