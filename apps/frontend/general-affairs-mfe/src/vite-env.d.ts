/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GENERAL_AFFAIRS_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
