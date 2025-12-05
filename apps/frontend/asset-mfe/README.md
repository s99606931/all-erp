# 자산 관리 MFE (Asset Micro Frontend)

자산 관리 마이크로 프론트엔드 애플리케이션입니다.

## 📦 기능

### 1. 기준정보관리 (4개 페이지)

- 법정동관리
- 자산분류등록
- 물품분류등록
- 물품규격등록

### 2. 자산대장관리 (9개 페이지)

- 자산취득등록
- 지출관리자산등록
- 자산상세대장조회
- 자본적 지출 자산조회
- 감가상각(만료자산)내역조회 (K-water/일반)
- 처분자산내역조회
- 유형자산명세서
- 자산원장조회

### 3. 건설중인자산 (6개 페이지)

- 건설중인공사일반사항등록
- 건설중인공사진행등록
- 건설중인공사완공대체조서작성
- 건설중인공사완공처리
- 건설중인공사현황조회
- 건설중인공사완공자산조회

### 4. 자산변동관리 (5개 페이지)

- 자산불용등록
- 자산처분등록
- 관리전환등록
- 자산분할등록
- 자산부서일괄변경

### 5. 감가상각관리 (3개 페이지)

- 감가상각대상오류자료검증
- 감가상각처리
- 감가상각처리\_NEW

**총 27개 메인 메뉴 (상세 페이지 포함 약 38개 화면)**

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3107 에서 접속 가능합니다.

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

- **Name**: `assetMfe`
- **Port**: 3107
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
