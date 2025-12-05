
import { PageLayout, DataTable } from '../../components/common';

/** 자동차검사현황 페이지 */
export default function InspectionStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'lastInspectionDate', title: '최근 검사일' },
    { key: 'nextInspectionDate', title: '다음 검사일' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="자동차검사현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
