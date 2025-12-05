import { PageLayout, DataTable, Button } from '../../components/common';

export default function ItemLocation() {
  const columns = [
    { key: 'locationCode', title: '장소코드' },
    { key: 'locationName', title: '장소명' },
    { key: 'building', title: '건물' },
    { key: 'floor', title: '층' },
  ];

  return (
    <PageLayout title="물품 장소(위치) 등록" actions={<Button>장소 추가</Button>}>
      <DataTable columns={columns} data={[]} />
    </PageLayout>
  );
}
