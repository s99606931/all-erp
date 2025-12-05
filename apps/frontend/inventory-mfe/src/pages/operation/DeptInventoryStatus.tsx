import { PageLayout, DataTable, Button } from '../../components/common';

export default function DeptInventoryStatus() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '이름' },
    { key: 'date', title: '날짜' },
  ];

  return (
    <PageLayout title="부서별 보유현황" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
