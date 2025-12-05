
import { PageLayout, DataTable, Button } from '../../components/common';

/** 자동차보험관리 페이지 */
export default function VehicleInsuranceManagement() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'insuranceCompany', title: '보험사' },
    { key: 'policyNumber', title: '증권번호' },
    { key: 'startDate', title: '시작일' },
    { key: 'endDate', title: '종료일' },
  ];

  return (
    <PageLayout title="자동차보험관리" actions={<Button>보험 등록</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
