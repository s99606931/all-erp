
import { PageLayout, DataTable } from '../../components/common';

/** 주차장수입현황 페이지 */
export default function ParkingRevenueStatus() {
  const columns = [
    { key: 'parkingLotName', title: '주차장명' },
    { key: 'dailyRevenue', title: '일 수입' },
    { key: 'monthlyRevenue', title: '월 수입' },
    { key: 'dailyVehicles', title: '일 차량 대수' },
  ];

  return (
    <PageLayout title="주차장수입현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
