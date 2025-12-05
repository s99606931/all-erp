
import { PageLayout, DataTable } from '../../components/common';

/** 사고수리현황 페이지 */
export default function AccidentRepairStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'accidentDate', title: '사고일' },
    { key: 'repairCost', title: '수리비' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="사고수리현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
