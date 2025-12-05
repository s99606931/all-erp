import { PageLayout, DataTable, Button } from '../../components/common';

export default function ItemSpecCode() {
  const columns = [
    { key: 'specCode', title: '규격코드' },
    { key: 'specName', title: '규격명' },
    { key: 'unit', title: '단위' },
  ];

  return (
    <PageLayout title="물품 규격코드 등록" actions={<Button>규격 추가</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
