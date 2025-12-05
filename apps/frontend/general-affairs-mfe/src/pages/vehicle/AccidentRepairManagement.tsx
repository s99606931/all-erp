
import { PageLayout, DataTable, Button } from '../../components/common';

/** 사고수리관리 페이지 */
export default function AccidentRepairManagement() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'accidentDate', title: '사고일' },
    { key: 'description', title: '사고 내용' },
    { key: 'repairCost', title: '수리비' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="사고수리관리" actions={<Button>사고 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
