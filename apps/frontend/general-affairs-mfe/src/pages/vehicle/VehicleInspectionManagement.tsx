
import { PageLayout, DataTable, Button } from '../../components/common';

/** 자동차검사관리 페이지 */
export default function VehicleInspectionManagement() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'inspectionType', title: '검사 종류' },
    { key: 'inspectionDate', title: '검사일' },
    { key: 'nextInspectionDate', title: '다음 검사일' },
    { key: 'result', title: '결과' },
  ];

  return (
    <PageLayout title="자동차검사관리" actions={<Button>검사 기록 추가</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
