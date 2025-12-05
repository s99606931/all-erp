
import { PageLayout, DataTable } from '../../components/common';

/** My배차/운행현황 페이지 */
export default function MyDispatchOperationStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'startDate', title: '시작일' },
    { key: 'endDate', title: '종료일' },
    { key: 'destination', title: '목적지' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="My배차/운행현황" description="내 배차 및 운행 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
