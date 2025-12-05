
import { PageLayout, DataTable } from '../../components/common';

/** 센터(시설)2연도별실적현황 페이지 */
export default function Center2AnnualPerformanceStatus() {
  const columns = [
    { key: 'year', title: '연도' },
    { key: 'centerName', title: '센터명' },
    { key: 'totalRevenue', title: '총 수입' },
  ];

  return (
    <PageLayout title="센터(시설)2연도별실적현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
