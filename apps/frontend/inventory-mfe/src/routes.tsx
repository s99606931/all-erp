import { Routes, Route } from 'react-router-dom';

// 기준정보관리 (3개)
import ItemClassification from './pages/master/ItemClassification';
import ItemSpecCode from './pages/master/ItemSpecCode';
import ItemLocation from './pages/master/ItemLocation';

// 물품취득관리 (4개)
import ItemAcquisitionRegister from './pages/acquisition/ItemAcquisitionRegister';
import ItemAcquisitionApproval from './pages/acquisition/ItemAcquisitionApproval';
import ItemAcquisitionStatus from './pages/acquisition/ItemAcquisitionStatus';
import ItemLedgerPrint from './pages/acquisition/ItemLedgerPrint';

// 물품운용관리 (13개)
import ItemOperationRegister from './pages/operation/ItemOperationRegister';
import ItemDivision from './pages/operation/ItemDivision';
import ItemRepairRegister from './pages/operation/ItemRepairRegister';
import ItemRepairStatus from './pages/operation/ItemRepairStatus';
import UsageConversionRegister from './pages/operation/UsageConversionRegister';
import UsageConversionApproval from './pages/operation/UsageConversionApproval';
import UsefulLifeChange from './pages/operation/UsefulLifeChange';
import ItemInventoryStatus from './pages/operation/ItemInventoryStatus';
import UsefulLifeItemStatus from './pages/operation/UsefulLifeItemStatus';
import DeptInventoryStatus from './pages/operation/DeptInventoryStatus';
import FixedQuantityItemStatus from './pages/operation/FixedQuantityItemStatus';
import FinanceSourceItemStatus from './pages/operation/FinanceSourceItemStatus';
import ItemLedger from './pages/operation/ItemLedger';

// 물품처분관리 (6개)
import DisposalRequest from './pages/disposal/DisposalRequest';
import DisposalRequestStatus from './pages/disposal/DisposalRequestStatus';
import DisposalRequestApproval from './pages/disposal/DisposalRequestApproval';
import ItemDisposalRegister from './pages/disposal/ItemDisposalRegister';
import ItemDisposalStatus from './pages/disposal/ItemDisposalStatus';
import ItemDisposalDetailStatus from './pages/disposal/ItemDisposalDetailStatus';

// 재물조사 (8개)
import InventoryCheckDataGen from './pages/inventory-check/InventoryCheckDataGen';
import InventoryCheckListPrint from './pages/inventory-check/InventoryCheckListPrint';
import InventoryCheckResultRegister from './pages/inventory-check/InventoryCheckResultRegister';
import InventoryCheckDetailRegister from './pages/inventory-check/InventoryCheckDetailRegister';
import InventoryCheckReport from './pages/inventory-check/InventoryCheckReport';
import InventoryBaseDataRegister from './pages/inventory-check/InventoryBaseDataRegister';
import InventoryCheckStatus from './pages/inventory-check/InventoryCheckStatus';
import InventoryCheckResultVerify from './pages/inventory-check/InventoryCheckResultVerify';

// 수급계획 (3개)
import DemandPlanReport from './pages/demand-plan/DemandPlanReport';
import DemandPlanDataGen from './pages/demand-plan/DemandPlanDataGen';
import DemandPlanRegister from './pages/demand-plan/DemandPlanRegister';

// 마감관리 (2개)
import ItemClosing from './pages/closing/ItemClosing';
import DemandPlanClosing from './pages/closing/DemandPlanClosing';

// 차량관리 (2개)
import VehicleOperation from './pages/vehicle/VehicleOperation';
import VehicleMaintenance from './pages/vehicle/VehicleMaintenance';

/**
 * 물품 관리 라우트 (58개 페이지)
 * Module Federation을 통해 Shell 앱에 노출됩니다.
 */
export default function InventoryRoutes() {
  return (
    <Routes>
      {/* 기준정보관리 (3개) */}
      <Route path="master/classification" element={<ItemClassification />} />
      <Route path="master/spec-code" element={<ItemSpecCode />} />
      <Route path="master/location" element={<ItemLocation />} />

      {/* 물품취득관리 (4개) */}
      <Route path="acquisition/register" element={<ItemAcquisitionRegister />} />
      <Route path="acquisition/approval" element={<ItemAcquisitionApproval />} />
      <Route path="acquisition/status" element={<ItemAcquisitionStatus />} />
      <Route path="acquisition/ledger-print" element={<ItemLedgerPrint />} />

      {/* 물품운용관리 (13개) */}
      <Route path="operation/register" element={<ItemOperationRegister />} />
      <Route path="operation/division" element={<ItemDivision />} />
      <Route path="operation/repair-register" element={<ItemRepairRegister />} />
      <Route path="operation/repair-status" element={<ItemRepairStatus />} />
      <Route path="operation/usage-conversion-register" element={<UsageConversionRegister />} />
      <Route path="operation/usage-conversion-approval" element={<UsageConversionApproval />} />
      <Route path="operation/useful-life-change" element={<UsefulLifeChange />} />
      <Route path="operation/inventory-status" element={<ItemInventoryStatus />} />
      <Route path="operation/useful-life-status" element={<UsefulLifeItemStatus />} />
      <Route path="operation/dept-status" element={<DeptInventoryStatus />} />
      <Route path="operation/fixed-quantity-status" element={<FixedQuantityItemStatus />} />
      <Route path="operation/finance-source-status" element={<FinanceSourceItemStatus />} />
      <Route path="operation/ledger" element={<ItemLedger />} />

      {/* 물품처분관리 (6개) */}
      <Route path="disposal/request" element={<DisposalRequest />} />
      <Route path="disposal/request-status" element={<DisposalRequestStatus />} />
      <Route path="disposal/request-approval" element={<DisposalRequestApproval />} />
      <Route path="disposal/register" element={<ItemDisposalRegister />} />
      <Route path="disposal/status" element={<ItemDisposalStatus />} />
      <Route path="disposal/detail-status" element={<ItemDisposalDetailStatus />} />

      {/* 재물조사 (8개) */}
      <Route path="inventory-check/data-gen" element={<InventoryCheckDataGen />} />
      <Route path="inventory-check/list-print" element={<InventoryCheckListPrint />} />
      <Route path="inventory-check/result-register" element={<InventoryCheckResultRegister />} />
      <Route path="inventory-check/detail-register" element={<InventoryCheckDetailRegister />} />
      <Route path="inventory-check/report" element={<InventoryCheckReport />} />
      <Route path="inventory-check/base-data-register" element={<InventoryBaseDataRegister />} />
      <Route path="inventory-check/status" element={<InventoryCheckStatus />} />
      <Route path="inventory-check/result-verify" element={<InventoryCheckResultVerify />} />

      {/* 수급계획 (3개) */}
      <Route path="demand-plan/report" element={<DemandPlanReport />} />
      <Route path="demand-plan/data-gen" element={<DemandPlanDataGen />} />
      <Route path="demand-plan/register" element={<DemandPlanRegister />} />

      {/* 마감관리 (2개) */}
      <Route path="closing/item" element={<ItemClosing />} />
      <Route path="closing/demand-plan" element={<DemandPlanClosing />} />

      {/* 차량관리 (2개) */}
      <Route path="vehicle/operation" element={<VehicleOperation />} />
      <Route path="vehicle/maintenance" element={<VehicleMaintenance />} />
    </Routes>
  );
}
