
import { PageLayout, DataTable } from '../../components/common';

/** 센터(시설)수입현황 페이지 */
export default function CenterRevenueStatus() {
  const columns = [
    { key: 'centerName', title: '센터명' },
    { key: 'monthlyRevenue', title: '월 수입' },
    { key: 'yearlyRevenue', title: '연 수입' },
    { key: 'growth', title: '증감율' },
  ];

  return (
    <PageLayout title="센터(시설)수입현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
