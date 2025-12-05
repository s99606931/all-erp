
import { PageLayout, DataTable, Button } from '../../components/common';

/** 센터(시설)인원실적관리 페이지 */
export default function CenterPersonnelPerformanceManagement() {
  const columns = [
    { key: 'centerName', title: '센터명' },
    { key: 'personnelName', title: '담당자' },
    { key: 'period', title: '기간' },
    { key: 'performance', title: '실적' },
    { key: 'target', title: '목표' },
    { key: 'achievement', title: '달성율' },
  ];

  return (
    <PageLayout title="센터(시설)인원실적관리" actions={<Button>실적 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
