
import { PageLayout, DataTable } from '../../components/common';

/** 센터(시설)기간별수지현황 페이지 */
export default function CenterPeriodBalanceStatus() {
  const columns = [
    { key: 'period', title: '기간' },
    { key: 'centerName', title: '센터명' },
    { key: 'revenue', title: '수입' },
    { key: 'expense', title: '지출' },
    { key: 'balance', title: '수지' },
    { key: 'profitRate', title: '수익률' },
  ];

  return (
    <PageLayout title="센터(시설)기간별수지현황" description="수입과 지출을 종합한 수지 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
