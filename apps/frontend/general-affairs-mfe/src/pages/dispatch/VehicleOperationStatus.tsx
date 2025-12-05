
import { PageLayout, DataTable } from '../../components/common';

/** 차량운행현황 페이지 */
export default function VehicleOperationStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'status', title: '상태' },
    { key: 'currentDriver', title: '현재 운전자' },
    { key: 'currentLocation', title: '현재 위치' },
    { key: 'todayDistance', title: '오늘 주행거리' },
  ];

  return (
    <PageLayout title="차량운행현황" description="실시간 차량 운행 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
