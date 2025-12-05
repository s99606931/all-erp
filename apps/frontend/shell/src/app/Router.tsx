import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ProtectedRoute from '../components/ProtectedRoute';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';

// Remote 앱 동적 로드
// 각 Remote 앱은 독립적으로 빌드되고 런타임에 로드됩니다.
const SystemRoutes = lazy(() => import('systemMfe/routes'));
const HrRoutes = lazy(() => import('hrMfe/routes'));
const PayrollRoutes = lazy(() => import('payrollMfe/routes'));
const AttendanceRoutes = lazy(() => import('attendanceMfe/routes'));
const BudgetRoutes = lazy(() => import('budgetMfe/routes'));
const TreasuryRoutes = lazy(() => import('treasuryMfe/routes'));
const AccountingRoutes = lazy(() => import('accountingMfe/routes'));
const AssetRoutes = lazy(() => import('assetMfe/routes'));
const InventoryRoutes = lazy(() => import('inventoryMfe/routes'));
const GeneralAffairsRoutes = lazy(() => import('generalAffairsMfe/routes'));

/**
 * 대시보드 페이지 (임시)
 */
function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 통계 카드 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">총 직원</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">1,234</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">이번 달 급여</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₩123M</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">예산 집행률</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">68%</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">재고 자산</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₩456M</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">주요 공지사항</h2>
        <ul className="space-y-3">
          <li className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600">2025-12-05</p>
            <p className="text-base text-gray-900">Micro Frontend 마이그레이션 완료</p>
          </li>
          <li className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600">2025-12-01</p>
            <p className="text-base text-gray-900">Database per Service 전환 완료</p>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * 메인 라우터 컴포넌트
 * Shell 앱의 라우팅과 Remote 앱들의 라우팅을 연결합니다.
 */
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 로그인 페이지 (인증 불필요) */}
        <Route path="/login" element={<Login />} />

        {/* 보호된 라우트 (인증 필요) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* 루트 경로는 대시보드로 리다이렉트 */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* 대시보드 */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Remote 앱 라우트 */}
          <Route
            path="/system/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SystemRoutes />
              </Suspense>
            }
          />

          <Route
            path="/hr/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HrRoutes />
              </Suspense>
            }
          />

          <Route
            path="/payroll/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <PayrollRoutes />
              </Suspense>
            }
          />

          <Route
            path="/attendance/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AttendanceRoutes />
              </Suspense>
            }
          />

          <Route
            path="/budget/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <BudgetRoutes />
              </Suspense>
            }
          />

          <Route
            path="/treasury/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <TreasuryRoutes />
              </Suspense>
            }
          />

          <Route
            path="/accounting/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AccountingRoutes />
              </Suspense>
            }
          />

          <Route
            path="/asset/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <AssetRoutes />
              </Suspense>
            }
          />

          <Route
            path="/inventory/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <InventoryRoutes />
              </Suspense>
            }
          />

          <Route
            path="/general-affairs/*"
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <GeneralAffairsRoutes />
              </Suspense>
            }
          />

          {/* 404 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
