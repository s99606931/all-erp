
import { Routes, Route } from 'react-router-dom';

// 결재관리함 (8개)
import DraftBox from './pages/approval/DraftBox';
import PendingApproval from './pages/approval/PendingApproval';
import InProgressApproval from './pages/approval/InProgressApproval';
import CirculationBox from './pages/approval/CirculationBox';
import CompletedApproval from './pages/approval/CompletedApproval';
import RejectedBox from './pages/approval/RejectedBox';
import ApprovalLineManagement from './pages/approval/ApprovalLineManagement';
import AbsenteeManagement from './pages/approval/AbsenteeManagement';

// 차량관리 (13개)
import VehicleRegistration from './pages/vehicle/VehicleRegistration';
import VehicleLeaseManagement from './pages/vehicle/VehicleLeaseManagement';
import VehicleInspectionManagement from './pages/vehicle/VehicleInspectionManagement';
import VehicleInsuranceManagement from './pages/vehicle/VehicleInsuranceManagement';
import AccidentRepairManagement from './pages/vehicle/AccidentRepairManagement';
import VehicleExpenseManagement from './pages/vehicle/VehicleExpenseManagement';
import VehicleInventoryStatus from './pages/vehicle/VehicleInventoryStatus';
import ExpirationStatus from './pages/vehicle/ExpirationStatus';
import LeaseStatus from './pages/vehicle/LeaseStatus';
import InspectionStatus from './pages/vehicle/InspectionStatus';
import InsuranceStatus from './pages/vehicle/InsuranceStatus';
import AccidentRepairStatus from './pages/vehicle/AccidentRepairStatus';
import ExpenseStatus from './pages/vehicle/ExpenseStatus';

// 차량운행관리 (8개)
import VehicleDispatchRequest from './pages/dispatch/VehicleDispatchRequest';
import DispatchExtensionRequest from './pages/dispatch/DispatchExtensionRequest';
import VehicleOperationLog from './pages/dispatch/VehicleOperationLog';
import VehicleOperationLogContinuous from './pages/dispatch/VehicleOperationLogContinuous';
import VehicleDispatchStatus from './pages/dispatch/VehicleDispatchStatus';
import VehicleOperationStatus from './pages/dispatch/VehicleOperationStatus';
import MyDispatchOperationStatus from './pages/dispatch/MyDispatchOperationStatus';
import VehicleDispatchCalendar from './pages/dispatch/VehicleDispatchCalendar';

// 대행사수입 (26개)
import CenterRevenueManagement from './pages/agency-revenue/CenterRevenueManagement';
import CenterRevenueStatus from './pages/agency-revenue/CenterRevenueStatus';
import CenterAnnualPerformanceStatus from './pages/agency-revenue/CenterAnnualPerformanceStatus';
import CenterPeriodPerformanceStatus from './pages/agency-revenue/CenterPeriodPerformanceStatus';
import CenterRevenueChart from './pages/agency-revenue/CenterRevenueChart';
import Center2RevenueManagement from './pages/agency-revenue/Center2RevenueManagement';
import Center2RevenueStatus from './pages/agency-revenue/Center2RevenueStatus';
import Center2AnnualPerformanceStatus from './pages/agency-revenue/Center2AnnualPerformanceStatus';
import Center2PeriodPerformanceStatus from './pages/agency-revenue/Center2PeriodPerformanceStatus';
import Center2RevenueChart from './pages/agency-revenue/Center2RevenueChart';
import CenterPersonnelPerformanceManagement from './pages/agency-revenue/CenterPersonnelPerformanceManagement';
import ParkingRevenueManagement from './pages/agency-revenue/ParkingRevenueManagement';
import ParkingRevenueStatus from './pages/agency-revenue/ParkingRevenueStatus';
import ParkingRevenueChart from './pages/agency-revenue/ParkingRevenueChart';
import CenterExpenseManagement from './pages/agency-revenue/CenterExpenseManagement';
import CenterPeriodBalanceStatus from './pages/agency-revenue/CenterPeriodBalanceStatus';
import CenterBalanceChart from './pages/agency-revenue/CenterBalanceChart';

/**
 * 총무 관리 라우트 컴포넌트
 * Module Federation을 통해 Shell 앱에 노출됩니다.
 * 
 * 메뉴 구조:
 * 1. 결재관리함 (8개)
 * 2. 차량관리 (13개)
 * 3. 차량운행관리 (8개)
 * 4. 대행사수입 (26개)
 * 총 55개 페이지
 */
export default function GeneralAffairsRoutes() {
  return (
    <Routes>
      {/* 결재관리함 (8개) */}
      <Route path="approval/draft" element={<DraftBox />} />
      <Route path="approval/pending" element={<PendingApproval />} />
      <Route path="approval/in-progress" element={<InProgressApproval />} />
      <Route path="approval/circulation" element={<CirculationBox />} />
      <Route path="approval/completed" element={<CompletedApproval />} />
      <Route path="approval/rejected" element={<RejectedBox />} />
      <Route path="approval/line-management" element={<ApprovalLineManagement />} />
      <Route path="approval/absentee-management" element={<AbsenteeManagement />} />

      {/* 차량관리 (13개) */}
      <Route path="vehicle/registration" element={<VehicleRegistration />} />
      <Route path="vehicle/lease-management" element={<VehicleLeaseManagement />} />
      <Route path="vehicle/inspection-management" element={<VehicleInspectionManagement />} />
      <Route path="vehicle/insurance-management" element={<VehicleInsuranceManagement />} />
      <Route path="vehicle/accident-repair" element={<AccidentRepairManagement />} />
      <Route path="vehicle/expense-management" element={<VehicleExpenseManagement />} />
      <Route path="vehicle/inventory-status" element={<VehicleInventoryStatus />} />
      <Route path="vehicle/expiration-status" element={<ExpirationStatus />} />
      <Route path="vehicle/lease-status" element={<LeaseStatus />} />
      <Route path="vehicle/inspection-status" element={<InspectionStatus />} />
      <Route path="vehicle/insurance-status" element={<InsuranceStatus />} />
      <Route path="vehicle/accident-repair-status" element={<AccidentRepairStatus />} />
      <Route path="vehicle/expense-status" element={<ExpenseStatus />} />

      {/* 차량운행관리 (8개) */}
      <Route path="dispatch/request" element={<VehicleDispatchRequest />} />
      <Route path="dispatch/extension-request" element={<DispatchExtensionRequest />} />
      <Route path="dispatch/operation-log" element={<VehicleOperationLog />} />
      <Route path="dispatch/operation-log-continuous" element={<VehicleOperationLogContinuous />} />
      <Route path="dispatch/dispatch-status" element={<VehicleDispatchStatus />} />
      <Route path="dispatch/operation-status" element={<VehicleOperationStatus />} />
      <Route path="dispatch/my-status" element={<MyDispatchOperationStatus />} />
      <Route path="dispatch/calendar" element={<VehicleDispatchCalendar />} />

      {/* 대행사수입 (26개) */}
      <Route path="agency/center-revenue-management" element={<CenterRevenueManagement />} />
      <Route path="agency/center-revenue-status" element={<CenterRevenueStatus />} />
      <Route path="agency/center-annual-performance" element={<CenterAnnualPerformanceStatus />} />
      <Route path="agency/center-period-performance" element={<CenterPeriodPerformanceStatus />} />
      <Route path="agency/center-revenue-chart" element={<CenterRevenueChart />} />
      <Route path="agency/center2-revenue-management" element={<Center2RevenueManagement />} />
      <Route path="agency/center2-revenue-status" element={<Center2RevenueStatus />} />
      <Route path="agency/center2-annual-performance" element={<Center2AnnualPerformanceStatus />} />
      <Route path="agency/center2-period-performance" element={<Center2PeriodPerformanceStatus />} />
      <Route path="agency/center2-revenue-chart" element={<Center2RevenueChart />} />
      <Route path="agency/center-personnel-performance" element={<CenterPersonnelPerformanceManagement />} />
      <Route path="agency/parking-revenue-management" element={<ParkingRevenueManagement />} />
      <Route path="agency/parking-revenue-status" element={<ParkingRevenueStatus />} />
      <Route path="agency/parking-revenue-chart" element={<ParkingRevenueChart />} />
      <Route path="agency/center-expense-management" element={<CenterExpenseManagement />} />
      <Route path="agency/center-period-balance" element={<CenterPeriodBalanceStatus />} />
      <Route path="agency/center-balance-chart" element={<CenterBalanceChart />} />
    </Routes>
  );
}
