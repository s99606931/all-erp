
import { PageLayout, DataTable } from '../../components/common';

/**
 * 반려함 페이지
 */
export default function RejectedBox() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'rejector', title: '반려자' },
    { key: 'reason', title: '반려사유' },
    { key: 'rejectedAt', title: '반려일' },
  ];

  return (
    <PageLayout title="반려함" description="반려된 문서 목록">
      <DataTable columns={columns} data={[]} emptyText="반려된 문서가 없습니다." />
    </PageLayout>
  );
}
