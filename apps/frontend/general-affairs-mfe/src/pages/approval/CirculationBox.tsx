
import { PageLayout, DataTable } from '../../components/common';

/**
 * 회람/공람함 페이지
 */
export default function CirculationBox() {
  const columns = [
    { key: 'title', title: '제목' },
    { key: 'drafter', title: '기안자' },
    { key: 'type', title: '유형' },
    { key: 'createdAt', title: '등록일' },
  ];

  return (
    <PageLayout title="회람/공람함" description="회람 및 공람 문서 목록">
      <DataTable columns={columns} data={[]} emptyText="회람/공람 문서가 없습니다." />
    </PageLayout>
  );
}
