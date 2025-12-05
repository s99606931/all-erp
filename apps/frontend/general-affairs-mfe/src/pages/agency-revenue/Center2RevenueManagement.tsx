
import { PageLayout, DataTable, Button } from '../../components/common';

/** 센터(시설)2수입관리 페이지 */
export default function Center2RevenueManagement() {
  const columns = [
    { key: 'centerName', title: '센터명' },
    { key: 'revenueDate', title: '수입일' },
    { key: 'revenueType', title: '수입 유형' },
    { key: 'amount', title: '금액' },
  ];

  return (
    <PageLayout title="센터(시설)2수입관리" description="2차 센터 수입 관리" actions={<Button>수입 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
