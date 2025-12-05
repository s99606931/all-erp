# 총무 관리 MFE (General Affairs Micro Frontend)

총무 관리 마이크로 프론트엔드 애플리케이션입니다.

## 📦 기능

### 1. 결재관리함 (8개 페이지)

- 기안함
- 결재대기함
- 결재진행함
- 회람/공람함
- 결재완료함
- 반려함
- 결재선관리
- 부재자설정관리

### 2. 차량관리 (13개 페이지)

- 차량등록관리
- 임대(리스)관리
- 자동차검사관리
- 자동차보험관리
- 사고수리관리
- 경비관리
- 차량보유현황
- 만기(예정일)현황
- 임대(리스)현황
- 자동차검사현황
- 자동차보험현황
- 사고수리현황
- 경비현황

### 3. 차량운행관리 (8개 페이지)

- 차량배차신청
- 배차연장신청
- 차량운행기록
- 차량운행기록(상시) -차량배차현황
- 차량운행현황
- My배차/운행현황
- 차량배차현황(달력)

### 4. 대행사수입 (26개 페이지)

- 센터(시설) 수입 관리 및 현황
- 센터(시설)2 수입 관리 및 현황
- 센터(시설) 인원 실적 관리
- 주차장 수입 관리 및 현황
- 센터(시설) 지출 관리
- 센터(시설) 수지 현황 및 차트

**총 55개 페이지**

## 🚀 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

http://localhost:3109 에서 접속 가능합니다.

### 빌드

```bash
pnpm build
```

### 미리보기

```bash
pnpm preview
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

## 📂 프로젝트 구조

```
src/
├── components/      # 공통 컴포넌트
│   └── common.tsx  # PageLayout, DataTable, Button 등
├── pages/          # 페이지 컴포넌트
│   ├── approval/   # 결재관리함 (8개)
│   ├── vehicle/    # 차량관리 (13개)
│   ├── dispatch/   # 차량운행관리 (8개)
│   └── agency-revenue/  # 대행사수입 (17개)
├── types/          # TypeScript 타입 정의
│   └── index.ts
├── lib/            # 유틸리티 및 설정
│   └── api-client.ts
├── routes.tsx      # 라우팅 설정
├── main.tsx        # 앱 엔트리 포인트
└── index.css       # 전역 스타일
```

## 🔧 환경 변수

`.env.example` 파일을 `.env`로 복사하고 환경 변수를 설정하세요:

```bash
VITE_GENERAL_AFFAIRS_API_URL=http://localhost:3010
```

## 🔌 Module Federation

이 앱은 Module Federation을 통해 Shell 앱에 통합됩니다.

- **Name**: `generalAffairsMfe`
- **Port**: 3109
- **Expose**: `./routes` - 라우팅 컴포넌트를 노출합니다

## 🌐 API 연동

백엔드 API 엔드포인트: `http://localhost:3010` (general-affairs-service)

API 클라이언트는 자동으로 다음을 추가합니다:

- Authorization Bearer 토큰
- X-Tenant-Id 헤더

## 📝 개발 가이드

### 새 페이지 추가

1. `src/pages/[카테고리]/[PageName].tsx` 파일 생성
2. `src/routes.tsx`에 라우트 추가
3. 필요한 타입을 `src/types/index.ts`에 추가

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

## 🐛 알려진 이슈

- TypeScript 빌드 시 React Router DOM과 @types/react 간 타입 불일치 (개발 서버는 정상 작동)
- 차트 컴포넌트 미구현 (향후 Chart.js 또는 Recharts 통합 예정)
- 달력 컴포넌트 미구현

## 📄 라이선스

MIT
