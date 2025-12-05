import { PageLayout, DataTable, Button } from '../../components/common';

export default function ItemClassification() {
  const columns = [
    { key: 'code', title: '분류코드' },
    { key: 'name', title: '분류명' },
    { key: 'parentCode', title: '상위분류' },
  ];

  return (
    <PageLayout title="물품 분류 등록" actions={<Button>분류 추가</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
