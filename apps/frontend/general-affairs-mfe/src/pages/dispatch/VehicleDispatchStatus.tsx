
import { PageLayout, DataTable } from '../../components/common';

/** 차량배차현황 페이지 */
export default function VehicleDispatchStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'requesterName', title: '신청자' },
    { key: 'startDate', title: '시작일' },
    { key: 'endDate', title: '종료일' },
    { key: 'destination', title: '목적지' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="차량배차현황" description="전체 배차 현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
