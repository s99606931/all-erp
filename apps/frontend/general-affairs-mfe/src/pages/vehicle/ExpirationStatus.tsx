
import { PageLayout, DataTable } from '../../components/common';

/** 만기(예정일)현황 페이지 */
export default function ExpirationStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'category', title: '항목' },
    { key: 'expirationDate', title: '만기일' },
    { key: 'daysRemaining', title: '남은 일수' },
  ];

  return (
    <PageLayout title="만기(예정일)현황" description="보험, 검사, 리스 만기 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
