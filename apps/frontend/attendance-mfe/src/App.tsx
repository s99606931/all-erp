import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AttendanceRoutes from './routes';

const queryClient = new QueryClient();

// 개발용 레이아웃
function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Attendance MFE</h1>
        <nav className="space-y-2">
          <Link to="/my" className="block p-2 hover:bg-gray-800 rounded">나의 근태</Link>
          <Link to="/leaves" className="block p-2 hover:bg-gray-800 rounded">휴가 신청</Link>
          <div className="h-px bg-gray-700 my-2"></div>
          <Link to="/approvals" className="block p-2 hover:bg-gray-800 rounded">근태 승인</Link>
          <Link to="/team" className="block p-2 hover:bg-gray-800 rounded">부서 근태</Link>
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
          <Routes>
            <Route path="/*" element={<AttendanceRoutes />} />
          </Routes>
        </DevLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
