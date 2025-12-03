import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** 대시보드 통계 카드 데이터 */
const DASHBOARD_STATS = [
  { title: "총 직원 수", value: "0명" },
  { title: "예산 집행률", value: "0%" },
  { title: "이번 달 매출", value: "0원" },
  { title: "미처리 알림", value: "0건" },
] as const;

/**
 * 홈(대시보드) 페이지 컴포넌트
 *
 * @description
 * ERP 시스템의 메인 대시보드 페이지입니다.
 * 주요 지표와 통계를 한눈에 볼 수 있도록 카드 형태로 표시합니다.
 *
 * 표시 정보:
 * - 총 직원 수
 * - 예산 집행률
 * - 이번 달 매출
 * - 미처리 알림
 */
export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 페이지 제목 */}
        <h1 className="text-3xl font-bold">대시보드</h1>

        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DASHBOARD_STATS.map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 환영 메시지 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>환영합니다!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All-ERP 통합 관리자 시스템에 오신 것을 환영합니다.
              <br />
              좌측 메뉴에서 원하는 기능을 선택하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
