
import { PageLayout, DataTable, Button } from '../../components/common';

/** 차량운행기록 페이지 */
export default function VehicleOperationLog() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'driverName', title: '운전자' },
    { key: 'startDate', title: '출발일시' },
    { key: 'endDate', title: '도착일시' },
    { key: 'distance', title: '주행거리(km)' },
    { key: 'destination', title: '목적지' },
  ];

  return (
    <PageLayout title="차량운행기록" actions={<Button>운행기록 추가</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
