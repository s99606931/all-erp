import { Routes, Route, Navigate } from 'react-router-dom';
import AccountSubjectManagePage from './pages/AccountSubjectManagePage';
import AccountSubjectSearchPage from './pages/AccountSubjectSearchPage';
import FinancialStatementArrayManagePage from './pages/FinancialStatementArrayManagePage';
import SpecificationMappingManagePage from './pages/SpecificationMappingManagePage';
import SettlementBusinessManagePage from './pages/SettlementBusinessManagePage';
import AccountSubjectMappingManagePage from './pages/AccountSubjectMappingManagePage';
import BudgetSubjectAccountMappingManagePage from './pages/BudgetSubjectAccountMappingManagePage';
import CashFlowSubjectManagePage from './pages/CashFlowSubjectManagePage';
import CostStatementSubjectManagePage from './pages/CostStatementSubjectManagePage';
import AdjustJournalEntryPage from './pages/AdjustJournalEntryPage';
import AccountingVoucherApprovalPage from './pages/AccountingVoucherApprovalPage';
import AccountingVoucherEditPage from './pages/AccountingVoucherEditPage';
import AccountingProcessVerifyPage from './pages/AccountingProcessVerifyPage';
import DailyTrialBalancePage from './pages/DailyTrialBalancePage';
import DepreciationBatchProcessPage from './pages/DepreciationBatchProcessPage';
import AdjustJournalEntryKWaterPage from './pages/AdjustJournalEntryKWaterPage';
import TrialBalancePage from './pages/TrialBalancePage';
import GeneralLedgerPage from './pages/GeneralLedgerPage';
import AccountLedgerPage from './pages/AccountLedgerPage';
import JournalPage from './pages/JournalPage';
import CustomerLedgerPage from './pages/CustomerLedgerPage';
import CustomerLedger2Page from './pages/CustomerLedger2Page';
import CustomerLedgerDeptPage from './pages/CustomerLedgerDeptPage';
import AccountBalanceSearchPage from './pages/AccountBalanceSearchPage';
import CustomerAccountBalancePage from './pages/CustomerAccountBalancePage';
import CustomerStatementPage from './pages/CustomerStatementPage';
import TrialBalanceKWaterPage from './pages/TrialBalanceKWaterPage';
import SettlementReportCreatePage from './pages/SettlementReportCreatePage';
import FinancialStatementsPage from './pages/FinancialStatementsPage';
import FinancialStatementsBusinessPage from './pages/FinancialStatementsBusinessPage';
import RealTimeFinancialStatementsPage from './pages/RealTimeFinancialStatementsPage';
import PeriodIncomeStatementPage from './pages/PeriodIncomeStatementPage';
import BudgetSettlementSummaryPage from './pages/BudgetSettlementSummaryPage';
import CashFlowStatementPage from './pages/CashFlowStatementPage';
import StatementOfChangesInEquityPage from './pages/StatementOfChangesInEquityPage';
import BusinessFinancialStatementsPage from './pages/BusinessFinancialStatementsPage';
import RealTimeBusinessFinancialStatementsPage from './pages/RealTimeBusinessFinancialStatementsPage';
import AssetStatementPage from './pages/AssetStatementPage';
import DepreciationStatementPage from './pages/DepreciationStatementPage';
import DepreciationSummaryPage from './pages/DepreciationSummaryPage';
import ProvisionStatementPage from './pages/ProvisionStatementPage';
import SurplusDeficitStatementPage from './pages/SurplusDeficitStatementPage';
import CostOfSalesStatementPage from './pages/CostOfSalesStatementPage';
import CashDepositStatementPage from './pages/CashDepositStatementPage';
import OpeningBalanceManagePage from './pages/OpeningBalanceManagePage';
import OpeningBalanceBusinessManagePage from './pages/OpeningBalanceBusinessManagePage';
import OpeningBalanceKWaterManagePage from './pages/OpeningBalanceKWaterManagePage';
import ClosingProcessPage from './pages/ClosingProcessPage';

/**
 * Accounting MFE 라우트 설정
 * Shell 앱에서 /accounting/* 경로로 마운트됩니다.
 */
export default function AccountingRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="trial-balance" replace />} />
      <Route path="account-subject-manage" element={<AccountSubjectManagePage />} />
      <Route path="account-subject-search" element={<AccountSubjectSearchPage />} />
      <Route path="financial-statement-array-manage" element={<FinancialStatementArrayManagePage />} />
      <Route path="specification-mapping-manage" element={<SpecificationMappingManagePage />} />
      <Route path="settlement-business-manage" element={<SettlementBusinessManagePage />} />
      <Route path="account-subject-mapping-manage" element={<AccountSubjectMappingManagePage />} />
      <Route path="budget-subject-account-mapping-manage" element={<BudgetSubjectAccountMappingManagePage />} />
      <Route path="cash-flow-subject-manage" element={<CashFlowSubjectManagePage />} />
      <Route path="cost-statement-subject-manage" element={<CostStatementSubjectManagePage />} />
      <Route path="adjust-journal-entry" element={<AdjustJournalEntryPage />} />
      <Route path="accounting-voucher-approval" element={<AccountingVoucherApprovalPage />} />
      <Route path="accounting-voucher-edit" element={<AccountingVoucherEditPage />} />
      <Route path="accounting-process-verify" element={<AccountingProcessVerifyPage />} />
      <Route path="daily-trial-balance" element={<DailyTrialBalancePage />} />
      <Route path="depreciation-batch-process" element={<DepreciationBatchProcessPage />} />
      <Route path="adjust-journal-entry-kwater" element={<AdjustJournalEntryKWaterPage />} />
      <Route path="trial-balance" element={<TrialBalancePage />} />
      <Route path="general-ledger" element={<GeneralLedgerPage />} />
      <Route path="account-ledger" element={<AccountLedgerPage />} />
      <Route path="journal" element={<JournalPage />} />
      <Route path="customer-ledger" element={<CustomerLedgerPage />} />
      <Route path="customer-ledger-2" element={<CustomerLedger2Page />} />
      <Route path="customer-ledger-dept" element={<CustomerLedgerDeptPage />} />
      <Route path="account-balance-search" element={<AccountBalanceSearchPage />} />
      <Route path="customer-account-balance" element={<CustomerAccountBalancePage />} />
      <Route path="customer-statement" element={<CustomerStatementPage />} />
      <Route path="trial-balance-kwater" element={<TrialBalanceKWaterPage />} />
      <Route path="settlement-report-create" element={<SettlementReportCreatePage />} />
      <Route path="financial-statements" element={<FinancialStatementsPage />} />
      <Route path="financial-statements-business" element={<FinancialStatementsBusinessPage />} />
      <Route path="real-time-financial-statements" element={<RealTimeFinancialStatementsPage />} />
      <Route path="period-income-statement" element={<PeriodIncomeStatementPage />} />
      <Route path="budget-settlement-summary" element={<BudgetSettlementSummaryPage />} />
      <Route path="cash-flow-statement" element={<CashFlowStatementPage />} />
      <Route path="statement-of-changes-in-equity" element={<StatementOfChangesInEquityPage />} />
      <Route path="business-financial-statements" element={<BusinessFinancialStatementsPage />} />
      <Route path="real-time-business-financial-statements" element={<RealTimeBusinessFinancialStatementsPage />} />
      <Route path="asset-statement" element={<AssetStatementPage />} />
      <Route path="depreciation-statement" element={<DepreciationStatementPage />} />
      <Route path="depreciation-summary" element={<DepreciationSummaryPage />} />
      <Route path="provision-statement" element={<ProvisionStatementPage />} />
      <Route path="surplus-deficit-statement" element={<SurplusDeficitStatementPage />} />
      <Route path="cost-of-sales-statement" element={<CostOfSalesStatementPage />} />
      <Route path="cash-deposit-statement" element={<CashDepositStatementPage />} />
      <Route path="opening-balance-manage" element={<OpeningBalanceManagePage />} />
      <Route path="opening-balance-business-manage" element={<OpeningBalanceBusinessManagePage />} />
      <Route path="opening-balance-kwater-manage" element={<OpeningBalanceKWaterManagePage />} />
      <Route path="closing-process" element={<ClosingProcessPage />} />
    </Routes>
  );
}
