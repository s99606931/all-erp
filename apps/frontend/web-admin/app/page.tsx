import { AppLayout } from "../components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export default function HomePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">대시보드</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">총 직원 수</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0명</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">예산 집행률</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0원</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">미처리 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0건</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>환영합니다!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All-ERP 통합 관리者 시스템에 오신 것을 환영합니다.
              <br />
              좌측 메뉴에서 원하는 기능을 선택하세요.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
