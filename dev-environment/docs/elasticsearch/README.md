# Elasticsearch (ops-elasticsearch)

## 1. 서비스 역할 (Service Role)
**Elasticsearch**는 **분산 검색 및 분석 엔진**입니다.
- 애플리케이션 로그 저장 및 검색
- 전문 검색 (Full-text Search) 기능 제공
- Logstash, Kibana와 함께 **ELK Stack**을 구성합니다.

## 2. 정상 작동 확인 (Verification)

### 접속 테스트
```bash
curl http://localhost:9200
```
정상 작동 시 JSON 형태의 클러스터 정보가 반환됩니다.

### 상태 확인
```bash
docker ps | grep ops-elasticsearch
```

## 3. 사용 가이드 (Usage Guide)

### 접속 정보
- **Port**: `9200` (HTTP), `9300` (Transport)
- **Security**: 현재 개발 환경에서는 보안(xpack.security)이 비활성화되어 있습니다.

### 기본 작업

#### 인덱스 생성
```bash
curl -X PUT "localhost:9200/products" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 0
  },
  "mappings": {
    "properties": {
      "name": { "type": "text" },
      "price": { "type": "integer" },
      "description": { "type": "text" }
    }
  }
}
'
```

#### 문서 추가
```bash
curl -X POST "localhost:9200/products/_doc" -H 'Content-Type: application/json' -d'
{
  "name": "무선 이어폰",
  "price": 59000,
  "description": "고음질 블루투스 이어폰"
}
'
```

#### 문서 검색
```bash
# 전체 문서 조회
curl "localhost:9200/products/_search?pretty"

# 특정 텍스트 검색
curl "localhost:9200/products/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "match": {
      "description": "블루투스"
    }
  }
}
'
```

### 데이터 관리
- 데이터는 `dev-environment/volumes/elasticsearch`에 저장됩니다.
- **주의**: 권한 문제로 실행이 안 될 경우 `sudo chown -R 1000:1000 volumes/elasticsearch` 명령어가 필요할 수 있습니다.
