import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Router from './Router';

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

/**
 * 루트 App 컴포넌트
 * React Query Provider로 앱을 감싸고 라우터를 렌더링합니다.
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
