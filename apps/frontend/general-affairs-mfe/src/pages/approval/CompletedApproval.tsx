
import { PageLayout, DataTable } from '../../components/common';

/**
 * 결재완료함 페이지
 */
export default function CompletedApproval() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'drafter', title: '기안자' },
    { key: 'completedAt', title: '완료일' },
  ];

  return (
    <PageLayout title="결재완료함" description="결재 완료된 문서 목록">
      <DataTable columns={columns} data={[]} emptyText="결재 완료된 문서가 없습니다." />
    </PageLayout>
  );
}
