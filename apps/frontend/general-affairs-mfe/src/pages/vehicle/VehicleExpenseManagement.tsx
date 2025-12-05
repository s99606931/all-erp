
import { PageLayout, DataTable, Button } from '../../components/common';

/** 경비관리 페이지 */
export default function VehicleExpenseManagement() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'expenseType', title: '경비 유형' },
    { key: 'amount', title: '금액' },
    { key: 'expenseDate', title: '지출일' },
    { key: 'description', title: '내용' },
  ];

  return (
    <PageLayout title="경비관리" actions={<Button>경비 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
