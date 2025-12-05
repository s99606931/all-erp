
import { PageLayout, Button } from '../../components/common';

/**
 * 결재선관리 페이지
 */
export default function ApprovalLineManagement() {
  return (
    <PageLayout 
      title="결재선관리"
      description="결재선 템플릿 관리"
      actions={<Button>새 결재선 추가</Button>}
    >
      <div className="approval-line-list">
        <p>결재선 템플릿이 없습니다.</p>
      </div>
    </PageLayout>
  );
}
