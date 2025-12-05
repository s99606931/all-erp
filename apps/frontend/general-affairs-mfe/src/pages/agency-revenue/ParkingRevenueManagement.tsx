
import { PageLayout, DataTable, Button } from '../../components/common';

/** 주차장수입관리 페이지 */
export default function ParkingRevenueManagement() {
  const columns = [
    { key: 'parkingLotName', title: '주차장명' },
    { key: 'revenueDate', title: '수입일' },
    { key: 'vehicleCount', title: '차량 대수' },
    { key: 'amount', title: '금액' },
  ];

  return (
    <PageLayout title="주차장수입관리" actions={<Button>수입 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
