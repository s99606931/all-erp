
import { PageLayout, DataTable, Button } from '../../components/common';

/**
 * 차량등록관리 페이지
 * 차량 정보를 등록하고 관리합니다.
 */
export default function VehicleRegistration() {
  const columns = [
    { key: 'licensePlate', title: '차량번호' },
    { key: 'model', title: '모델' },
    { key: 'manufacturer', title: '제조사' },
    { key: 'year', title: '연식' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout 
      title="차량등록관리"
      description="차량 정보 등록 및 관리"
      actions={<Button>차량 등록</Button>}
    >
      <DataTable columns={columns} data={[]} emptyText="등록된 차량이 없습니다." />
    </PageLayout>
  );
}
