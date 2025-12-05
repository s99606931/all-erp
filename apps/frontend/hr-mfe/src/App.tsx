import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HrRoutes from './routes';

const queryClient = new QueryClient();

// 개발용 레이아웃 (Shell 앱의 레이아웃을 흉내냄)
function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">HR MFE (Dev)</h1>
        <nav className="space-y-2">
          <Link to="/employees" className="block p-2 hover:bg-gray-800 rounded">직원 관리</Link>
          <Link to="/departments" className="block p-2 hover:bg-gray-800 rounded">부서 관리</Link>
          <Link to="/positions" className="block p-2 hover:bg-gray-800 rounded">직급 관리</Link>
          <div className="h-px bg-gray-700 my-2"></div>
          <Link to="/attendance" className="block p-2 hover:bg-gray-800 rounded">근태 관리</Link>
          <Link to="/payroll" className="block p-2 hover:bg-gray-800 rounded">급여 관리</Link>
        </nav>
      </div>
      <div className="flex-1 p-8 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DevLayout>
          {/* 독립 실행 시 라우트 설정 */}
          <Routes>
            <Route path="/*" element={<HrRoutes />} />
          </Routes>
        </DevLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
