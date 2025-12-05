# 물품 관리 MFE (Inventory Micro Frontend)

물품(재고) 관리 마이크로 프론트엔드 애플리케이션입니다.

## 📦 기능

### 1. 기준정보관리 (3개 페이지)

- 물품 분류 등록
- 물품 규격코드 등록
- 물품 장소(위치) 등록

### 2. 물품취득관리 (4개 페이지)

- 물품취득 등록/승인
- 물품 취득 현황
- 물품수입 및 출급원장 출력

### 3. 물품운용관리 (13개 페이지)

- 물품운용 등록/분할
- 물품수리내역 등록/현황
- 사용(관리)전환 등록/승인
- 내용연수 및 회계자산여부 변경
- 각종 물품보유현황 (부서별, 정수관리, 재원구분별 등)
- 물품원장

### 4. 물품처분관리 (6개 페이지)

- 불용신청/승인/현황
- 물품처분 등록/현황

### 5. 재물조사 (8개 페이지)

- 재물조사자료 생성
- 재물조사목록표 출력
- 재물조사 실사결과 등록/상세등록
- 재물조사표
- 물품 기초자료 등록
- 재물조사현황/검증

### 6. 수급계획 (3개 페이지)

- 물품수급관리계획서
- 수급계획자료 생성
- 수급계획 등록

### 7. 마감관리 (2개 페이지)

- 물품마감관리
- 물품수급집계마감

### 8. 차량관리 (2개 페이지)

- 차량운행관리
- 차량유지관리

**총 41개 메뉴 (상세 페이지 포함 약 58개 화면)**

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3108 에서 접속 가능합니다.

### 빌드

```bash
pnpm build
```

## 🏗️ 기술 스택

- **React** 18.3.1
- **TypeScript** 5.6.2
- **Vite** 5.4.9
- **React Router DOM** 6.26.2
- **Module Federation** (@originjs/vite-plugin-federation)
- **Axios** - API 통신
- **Zustand** - 상태 관리
- **React Query** - 서버 상태 관리

## 🔌 Module Federation

이 앱은 Module Federation을 통해 Shell 앱에 통합됩니다.

- **Name**: `inventoryMfe`
- **Port**: 3108
- **Expose**: `./routes` - 라우팅 컴포넌트를 노출합니다

## 📝 개발 가이드

### 새 페이지 추가

1. `src/pages/[카테고리]/[PageName].tsx` 파일 생성
2. `src/routes.tsx`에 라우트 추가

### 공통 컴포넌트 사용

```tsx
import { PageLayout, DataTable, Button } from '../../components/common';

export default function MyPage() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '이름' },
  ];

  return (
    <PageLayout title="페이지 제목" actions={<Button>액션</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
```

## 📄 라이선스

MIT
