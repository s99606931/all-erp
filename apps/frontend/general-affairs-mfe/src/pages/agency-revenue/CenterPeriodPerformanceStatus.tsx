
import { PageLayout, DataTable } from '../../components/common';

/** 센터(시설)기간별실적현황 페이지 */
export default function CenterPeriodPerformanceStatus() {
  const columns = [
    { key: 'period', title: '기간' },
    { key: 'centerName', title: '센터명' },
    { key: 'revenue', title: '수입' },
    { key: 'expense', title: '지출' },
    { key: 'profit', title: '수익' },
  ];

  return (
    <PageLayout title="센터(시설)기간별실적현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
