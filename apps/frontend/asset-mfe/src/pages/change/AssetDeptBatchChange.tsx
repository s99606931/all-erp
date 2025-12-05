import { PageLayout, DataTable, Button } from '../../components/common';

export default function AssetDeptBatchChange() {
  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: '자산명' },
    { key: 'code', title: '자산코드' },
    { key: 'date', title: '등록일' },
  ];

  return (
    <PageLayout title="자산부서일괄변경" actions={<Button>등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
