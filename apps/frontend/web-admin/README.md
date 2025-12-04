# Web Admin Frontend

All-ERP 시스템의 관리자 웹 프론트엔드 애플리케이션입니다.

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **UI 컴포넌트**: Radix UI 기반 커스텀 컴포넌트
- **상태 관리**: TanStack Query (React Query)
- **테마**: next-themes (다크모드 지원)
- **모노레포**: Nx

## 주요 기능

### 🎨 디자인 시스템

- **다크/라이트 모드**: 시스템 테마 자동 감지 및 수동 전환
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- **재사용 가능한 컴포넌트**: Button, Card, Input 등 shadcn/ui 기반

### 🧭 레이아웃

- **사이드바**: 토글 가능한 네비게이션 (모바일에서는 오버레이)
- **헤더**: 메뉴 버튼, 테마 전환, 사용자 정보
- **메인 콘텐츠**: 스크롤 가능한 페이지 영역

### 📊 대시보드

- 총 직원 수
- 예산 집행률
- 이번 달 매출
- 미처리 알림

## 프로젝트 구조

```
apps/frontend/web-admin/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈(대시보드) 페이지
│   ├── global.css         # 전역 스타일 및 디자인 토큰
│   ├── providers/         # Context Provider들
│   │   ├── theme-provider.tsx
│   │   └── query-provider.tsx
│   └── components/        # 페이지별 컴포넌트
│
├── components/            # 공유 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   │   ├── app-layout.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   └── ui/               # UI 컴포넌트 (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
│
├── hooks/                # 커스텀 훅
│   └── use-mobile.tsx    # 모바일 감지 훅
│
├── lib/                  # 유틸리티 함수
│   └── utils.ts          # 클래스명 병합 등
│
└── public/               # 정적 파일
```

## 개발 가이드

### 설치

```bash
# 프로젝트 루트에서
pnpm install
```

### 개발 서버 실행

**Docker Compose 사용 (권장)**:

```bash
cd dev-environment
docker compose -f docker-compose.dev.yml up -d
```

**로컬 실행**:

```bash
# Nx를 사용한 실행
nx serve web-admin

# 또는 npm script
pnpm run dev:web-admin
```

### 빌드

```bash
# 프로덕션 빌드
nx build web-admin

# 또는
pnpm run build:web-admin
```

## 코드 규칙

### 주석 작성

- 모든 주석은 **한국어**로 작성합니다
- 함수/컴포넌트에는 JSDoc 스타일의 설명을 추가합니다
- 복잡한 로직에는 인라인 주석을 추가합니다

### 컴포넌트 작성

```typescript
/**
 * 컴포넌트 설명
 *
 * @description
 * 상세한 설명을 여기에 작성합니다.
 *
 * @param props - Props 설명
 */
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 구현
}
```

### 스타일링

- Tailwind CSS 사용 권장
- `cn()` 유틸리티로 조건부 클래스 병합
- 디자인 토큰 사용 (예: `bg-background`, `text-foreground`)

### 타입 안정성

- `any` 사용 금지
- Props에 명시적 타입 정의
- 이벤트 핸들러에 적절한 타입 지정

## 디자인 토큰

### 색상

전역 CSS 변수로 정의된 색상을 사용합니다:

- `--background`: 배경색
- `--foreground`: 텍스트색
- `--primary`: 주요 색상
- `--secondary`: 보조 색상
- `--muted`: 음소거 색상
- `--accent`: 강조 색상
- `--destructive`: 위험/삭제 색상

### 테마

- 자동으로 라이트/다크 모드 감지
- 사용자가 수동으로 전환 가능
- 로컬 스토리지에 설정 저장

## 성능 최적화

### 적용된 최적화

- ✅ `useCallback`으로 불필요한 재렌더링 방지
- ✅ React Query로 서버 상태 캐싱
- ✅ Next.js Image 컴포넌트 사용 (필요시)
- ✅ 코드 스플리팅 (Next.js 자동 처리)

### 권장사항

- 큰 리스트는 가상화 라이브러리 사용 고려
- 이미지는 최적화된 포맷 사용 (WebP)
- 불필요한 리렌더링 최소화

## 접근성

### 구현된 기능

- ✅ `aria-label` 속성으로 스크린리더 지원
- ✅ 키보드 네비게이션 지원
- ✅ 포커스 인디케이터 표시
- ✅ 시맨틱 HTML 사용

## 브라우저 지원

- Chrome (최신 2개 버전)
- Firefox (최신 2개 버전)
- Safari (최신 2개 버전)
- Edge (최신 2개 버전)

## 문의

프로젝트 관련 문의사항은 개발팀에 연락주세요.
