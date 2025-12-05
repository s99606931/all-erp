import { create } from 'zustand';

// 앱 상태 인터페이스
interface AppState {
  // 사이드바 상태
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // 로딩 상태
  isLoading: boolean;
  
  // 현재 선택된 테넌트
  currentTenant: string | null;
  
  // 액션
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (loading: boolean) => void;
  setCurrentTenant: (tenantId: string) => void;
}

// 앱 전역 상태 스토어
export const useAppStore = create<AppState>((set) => ({
  // 초기 상태
  sidebarOpen: true,
  sidebarCollapsed: false,
  isLoading: false,
  currentTenant: null,

  // 사이드바 토글
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // 사이드바 축소/확장
  setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),

  // 로딩 상태 설정
  setLoading: (loading: boolean) => set({ isLoading: loading }),

  // 현재 테넌트 설정
  setCurrentTenant: (tenantId: string) => set({ currentTenant: tenantId }),
}));
