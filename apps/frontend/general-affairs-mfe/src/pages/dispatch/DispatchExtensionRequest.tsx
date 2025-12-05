
import { PageLayout, DataTable } from '../../components/common';

/** 배차연장신청 페이지 */
export default function DispatchExtensionRequest() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'currentEndDate', title: '현재 종료일' },
    { key: 'requestedEndDate', title: '연장 요청일' },
    { key: 'status', title: '상태' },
  ];

  return (
    <PageLayout title="배차연장신청" description="배차 기간 연장 신청">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
