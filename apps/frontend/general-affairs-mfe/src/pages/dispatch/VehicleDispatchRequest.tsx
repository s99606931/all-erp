
import { PageLayout, Button, InputField, SelectField } from '../../components/common';

/** 차량배차신청 페이지 */
export default function VehicleDispatchRequest() {
  return (
    <PageLayout title="차량배차신청" description="차량 배차 신청">
      <form className="dispatch-request-form">
        <SelectField name="vehicleId" label="차량 선택" options={[]} required />
        <InputField name="startDate" label="시작일" type="date" required />
        <InputField name="endDate" label="종료일" type="date" required />
        <InputField name="destination" label="목적지" required />
        <InputField name="purpose" label="사용 목적" required />
        <InputField name="passengerCount" label="탑승 인원" type="number" required />
        <Button type="submit">신청</Button>
      </form>
    </PageLayout>
  );
}
