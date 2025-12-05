
import { PageLayout, DataTable } from '../../components/common';

/** 차량보유현황 페이지 */
export default function VehicleInventoryStatus() {
  const columns = [
    { key: 'licensePlate', title: '차량번호' },
    { key: 'model', title: '모델' },
    { key: 'year', title: '연식' },
    { key: 'status', title: '상태' },
    { key: 'location', title: '위치' },
  ];

  return (
    <PageLayout title="차량보유현황" description="전체 차량 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
