
import { PageLayout, DataTable, Button } from '../../components/common';

/**
 * 기안함 페이지
 * 사용자가 작성한 결재 문서 목록을 보여줍니다.
 */
export default function DraftBox() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'status', title: '상태' },
    { key: 'createdAt', title: '작성일' },
  ];

  const mockData: any[] = [];

  return (
    <PageLayout 
      title="기안함"
      description="작성한 결재 문서 목록"
      actions={<Button onClick={() => console.log('새 기안 작성')}>새 기안 작성</Button>}
    >
      <DataTable columns={columns} data={mockData} emptyText="작성한 기안이 없습니다." />
    </PageLayout>
  );
}
