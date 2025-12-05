import { PageLayout, DataTable, Button } from '../../components/common';

export default function AssetClassification() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '자산명' },
    { key: 'code', title: '자산코드' },
    { key: 'date', title: '등록일' },
  ];

  return (
    <PageLayout title="자산분류등록" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
