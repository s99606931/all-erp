import { Routes, Route } from 'react-router-dom';

// 기준정보관리 (4개)
import LegalDongManagement from './pages/master/LegalDongManagement';
import AssetClassification from './pages/master/AssetClassification';
import ItemClassification from './pages/master/ItemClassification';
import ItemSpec from './pages/master/ItemSpec';

// 자산대장관리 (9개)
import AssetAcquisition from './pages/ledger/AssetAcquisition';
import ExpenseAssetRegister from './pages/ledger/ExpenseAssetRegister';
import AssetDetailLedger from './pages/ledger/AssetDetailLedger';
import CapitalExpenseAsset from './pages/ledger/CapitalExpenseAsset';
import DepreciationHistoryKwater from './pages/ledger/DepreciationHistoryKwater';
import DepreciationHistory from './pages/ledger/DepreciationHistory';
import DisposedAssetHistory from './pages/ledger/DisposedAssetHistory';
import TangibleAssetStatement from './pages/ledger/TangibleAssetStatement';
import AssetLedger from './pages/ledger/AssetLedger';

// 건설중인자산 (6개)
import ConstructionGeneralInfo from './pages/construction/ConstructionGeneralInfo';
import ConstructionProgress from './pages/construction/ConstructionProgress';
import ConstructionCompletionReport from './pages/construction/ConstructionCompletionReport';
import ConstructionCompletionProcess from './pages/construction/ConstructionCompletionProcess';
import ConstructionStatus from './pages/construction/ConstructionStatus';
import ConstructionCompletedAsset from './pages/construction/ConstructionCompletedAsset';

// 자산변동관리 (5개)
import AssetDisuseRegister from './pages/change/AssetDisuseRegister';
import AssetDisposalRegister from './pages/change/AssetDisposalRegister';
import ManagementTransferRegister from './pages/change/ManagementTransferRegister';
import AssetDivisionRegister from './pages/change/AssetDivisionRegister';
import AssetDeptBatchChange from './pages/change/AssetDeptBatchChange';

// 감가상각관리 (3개)
import DepreciationErrorVerify from './pages/depreciation/DepreciationErrorVerify';
import DepreciationProcess from './pages/depreciation/DepreciationProcess';
import DepreciationProcessNew from './pages/depreciation/DepreciationProcessNew';

/**
 * 자산 관리 라우트 (27개 메인 페이지 + 상세)
 * Module Federation을 통해 Shell 앱에 노출됩니다.
 */
export default function AssetRoutes() {
  return (
    <Routes>
      {/* 기준정보관리 */}
      <Route path="master/legal-dong" element={<LegalDongManagement />} />
      <Route path="master/classification" element={<AssetClassification />} />
      <Route path="master/item-classification" element={<ItemClassification />} />
      <Route path="master/item-spec" element={<ItemSpec />} />

      {/* 자산대장관리 */}
      <Route path="ledger/acquisition" element={<AssetAcquisition />} />
      <Route path="ledger/expense-asset" element={<ExpenseAssetRegister />} />
      <Route path="ledger/detail" element={<AssetDetailLedger />} />
      <Route path="ledger/capital-expense" element={<CapitalExpenseAsset />} />
      <Route path="ledger/depreciation-kwater" element={<DepreciationHistoryKwater />} />
      <Route path="ledger/depreciation" element={<DepreciationHistory />} />
      <Route path="ledger/disposed" element={<DisposedAssetHistory />} />
      <Route path="ledger/tangible-statement" element={<TangibleAssetStatement />} />
      <Route path="ledger/ledger" element={<AssetLedger />} />

      {/* 건설중인자산 */}
      <Route path="construction/general" element={<ConstructionGeneralInfo />} />
      <Route path="construction/progress" element={<ConstructionProgress />} />
      <Route path="construction/completion-report" element={<ConstructionCompletionReport />} />
      <Route path="construction/completion-process" element={<ConstructionCompletionProcess />} />
      <Route path="construction/status" element={<ConstructionStatus />} />
      <Route path="construction/completed-asset" element={<ConstructionCompletedAsset />} />

      {/* 자산변동관리 */}
      <Route path="change/disuse" element={<AssetDisuseRegister />} />
      <Route path="change/disposal" element={<AssetDisposalRegister />} />
      <Route path="change/transfer" element={<ManagementTransferRegister />} />
      <Route path="change/division" element={<AssetDivisionRegister />} />
      <Route path="change/dept-batch" element={<AssetDeptBatchChange />} />

      {/* 감가상각관리 */}
      <Route path="depreciation/error-verify" element={<DepreciationErrorVerify />} />
      <Route path="depreciation/process" element={<DepreciationProcess />} />
      <Route path="depreciation/process-new" element={<DepreciationProcessNew />} />
    </Routes>
  );
}
