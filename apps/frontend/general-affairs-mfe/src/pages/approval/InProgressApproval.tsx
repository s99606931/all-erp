
import { PageLayout, DataTable } from '../../components/common';

/**
 * 결재진행함 페이지
 */
export default function InProgressApproval() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'drafter', title: '기안자' },
    { key: 'currentApprover', title: '현재 결재자' },
    { key: 'createdAt', title: '기안일' },
  ];

  return (
    <PageLayout title="결재진행함" description="결재 진행 중인 문서 목록">
      <DataTable columns={columns} data={[]} emptyText="결재 진행 중인 문서가 없습니다." />
    </PageLayout>
  );
}
