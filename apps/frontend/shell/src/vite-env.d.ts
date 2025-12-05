/// <reference types="vite/client" />

// Vite 환경 변수 타입 정의
interface ImportMetaEnv {
  readonly VITE_API_GATEWAY_URL: string;
  readonly VITE_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
