import { PageLayout, DataTable, Button } from '../../components/common';

export default function ItemLedgerPrint() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '이름' },
    { key: 'date', title: '날짜' },
  ];

  return (
    <PageLayout title="물품수입 및 출급원장 출력" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
