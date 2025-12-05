import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import GeneralAffairsRoutes from './routes';
import './index.css';

/**
 * 총무 관리 MFE 엔트리 포인트
 * 독립 실행 모드에서 사용됩니다.
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginBottom: '20px' }}>총무 관리 시스템</h1>
        <GeneralAffairsRoutes />
      </div>
    </BrowserRouter>
  </React.StrictMode>
);
