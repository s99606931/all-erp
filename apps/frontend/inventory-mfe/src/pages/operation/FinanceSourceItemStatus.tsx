import { PageLayout, DataTable, Button } from '../../components/common';

export default function FinanceSourceItemStatus() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '이름' },
    { key: 'date', title: '날짜' },
  ];

  return (
    <PageLayout title="재원구분별 물품현황" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
