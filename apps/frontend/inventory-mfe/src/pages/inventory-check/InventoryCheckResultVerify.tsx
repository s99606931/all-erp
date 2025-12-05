import { PageLayout, DataTable, Button } from '../../components/common';

export default function InventoryCheckResultVerify() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '이름' },
    { key: 'date', title: '날짜' },
  ];

  return (
    <PageLayout title="재물조사실사결과검증" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
