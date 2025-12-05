
import { PageLayout, DataTable, Button } from '../../components/common';

/** 임대(리스)관리 페이지 */
export default function VehicleLeaseManagement() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'lessor', title: '임대사' },
    { key: 'startDate', title: '시작일' },
    { key: 'endDate', title: '종료일' },
    { key: 'monthlyFee', title: '월 임대료' },
  ];

  return (
    <PageLayout title="임대(리스)관리" actions={<Button>리스 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
