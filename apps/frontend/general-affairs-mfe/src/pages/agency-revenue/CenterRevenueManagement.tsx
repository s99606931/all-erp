
import { PageLayout, DataTable, Button } from '../../components/common';

/** 센터(시설)수입관리 페이지 */
export default function CenterRevenueManagement() {
  const columns = [
    { key: 'centerName', title: '센터명' },
    { key: 'revenueDate', title: '수입일' },
    { key: 'revenueType', title: '수입 유형' },
    { key: 'amount', title: '금액' },
    { key: 'description', title: '비고' },
  ];

  return (
    <PageLayout title="센터(시설)수입관리" actions={<Button>수입 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
