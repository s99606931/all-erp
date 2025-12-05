
import { PageLayout, DataTable } from '../../components/common';

/** 차량운행기록(상시) 페이지 */
export default function VehicleOperationLogContinuous() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'driverName', title: '운전자' },
    { key: 'operationDate', title: '운행일' },
    { key: 'totalDistance', title: '일일 주행거리' },
    { key: 'fuelCost', title: '유류비' },
  ];

  return (
    <PageLayout title="차량운행기록(상시)" description="상시 운행 차량 기록">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
