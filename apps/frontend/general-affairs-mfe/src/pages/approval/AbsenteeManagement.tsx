
import { PageLayout, DataTable, Button } from '../../components/common';

/**
 * 부재자설정관리 페이지
 */
export default function AbsenteeManagement() {
  const columns = [
    { key: 'userName', title: '사용자' },
    { key: 'substitute', title: '대리자' },
    { key: 'startDate', title: '시작일' },
    { key: 'endDate', title: '종료일' },
  ];

  return (
    <PageLayout 
      title="부재자설정관리"
      description="부재 시 결재 대리자 설정"
      actions={<Button>부재 설정 추가</Button>}
    >
      <DataTable columns={columns} data={[]} emptyText="부재 설정이 없습니다." />
    </PageLayout>
  );
}
