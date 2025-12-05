
import { PageLayout, DataTable, Button } from '../../components/common';

/**
 * 결재대기함 페이지
 * 결재 대기 중인 문서 목록을 보여줍니다.
 */
export default function PendingApproval() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'drafter', title: '기안자' },
    { key: 'createdAt', title: '기안일' },
  ];

  const mockData: any[] = [];

  return (
    <PageLayout 
      title="결재대기함"
      description="결재 대기 중인 문서 목록"
    >
      <DataTable columns={columns} data={mockData} emptyText="결재 대기 문서가 없습니다." />
    </PageLayout>
  );
}
