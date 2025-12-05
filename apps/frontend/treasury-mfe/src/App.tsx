import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TreasuryRoutes from './routes';

const queryClient = new QueryClient();

// 개발용 레이아웃
function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">Treasury MFE (Dev)</h1>
        <nav className="space-y-2">
          <Link to="/flow" className="block p-2 hover:bg-gray-800 rounded">자금 현황</Link>
          <Link to="/accounts" className="block p-2 hover:bg-gray-800 rounded">계좌 관리</Link>
          <Link to="/transfer" className="block p-2 hover:bg-gray-800 rounded">자금 이체</Link>
          <Link to="/cards" className="block p-2 hover:bg-gray-800 rounded">법인카드</Link>
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
            <Route path="/*" element={<TreasuryRoutes />} />
          </Routes>
        </DevLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
