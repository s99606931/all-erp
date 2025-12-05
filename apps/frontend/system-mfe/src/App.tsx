import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SystemRoutes from './routes';

const queryClient = new QueryClient();

// 개발용 레이아웃
function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gray-900 text-white p-4">
        <h1 className="text-xl font-bold mb-8">System MFE (Dev)</h1>
        <nav className="space-y-2">
          <Link to="/users" className="block p-2 hover:bg-gray-800 rounded">사용자 관리</Link>
          <Link to="/codes" className="block p-2 hover:bg-gray-800 rounded">공통 코드</Link>
          <Link to="/roles" className="block p-2 hover:bg-gray-800 rounded">권한 관리</Link>
          <Link to="/menus" className="block p-2 hover:bg-gray-800 rounded">메뉴 관리</Link>
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
            <Route path="/*" element={<SystemRoutes />} />
          </Routes>
        </DevLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
