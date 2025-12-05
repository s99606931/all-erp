
import { PageLayout, DataTable } from '../../components/common';

/** 경비현황 페이지 */
export default function ExpenseStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'totalExpense', title: '총 경비' },
    { key: 'fuelCost', title: '유류비' },
    { key: 'maintenanceCost', title: '정비비' },
    { key: 'otherCost', title: '기타' },
  ];

  return (
    <PageLayout title="경비현황" description="차량별 경비 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
