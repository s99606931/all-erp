
import { PageLayout, DataTable } from '../../components/common';

/** 임대(리스)현황 페이지 */
export default function LeaseStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'lessor', title: '임대사' },
    { key: 'monthlyFee', title: '월 임대료' },
    { key: 'endDate', title: '종료일' },
  ];

  return (
    <PageLayout title="임대(리스)현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
