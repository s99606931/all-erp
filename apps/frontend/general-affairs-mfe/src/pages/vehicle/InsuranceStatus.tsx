
import { PageLayout, DataTable } from '../../components/common';

/** 자동차보험현황 페이지 */
export default function InsuranceStatus() {
  const columns = [
    { key: 'vehicleName', title: '차량' },
    { key: 'insuranceCompany', title: '보험사' },
    { key: 'endDate', title: '만기일' },
    { key: 'premium', title: '보험료' },
  ];

  return (
    <PageLayout title="자동차보험현황">
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
