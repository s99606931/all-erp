
import { PageLayout, DataTable, Button } from '../../components/common';

/** 센터(시설)지출관리 페이지 */
export default function CenterExpenseManagement() {
  const columns = [
    { key: 'centerName', title: '센터명' },
    { key: 'expenseDate', title: '지출일' },
    { key: 'expenseType', title: '지출 유형' },
    { key: 'amount', title: '금액' },
    { key: 'description', title: '비고' },
  ];

  return (
    <PageLayout title="센터(시설)지출관리" actions={<Button>지출 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
