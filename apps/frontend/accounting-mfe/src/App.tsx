import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AccountingRoutes from './routes';

const queryClient = new QueryClient();

// 개발용 레이아웃
function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Accounting MFE</h1>
        <nav className="space-y-2">
          <Link to="/slips" className="block p-2 hover:bg-gray-800 rounded">전표 관리</Link>
          <Link to="/reports" className="block p-2 hover:bg-gray-800 rounded">재무제표</Link>
          <Link to="/accounts" className="block p-2 hover:bg-gray-800 rounded">계정과목</Link>
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
            <Route path="/*" element={<AccountingRoutes />} />
          </Routes>
        </DevLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
