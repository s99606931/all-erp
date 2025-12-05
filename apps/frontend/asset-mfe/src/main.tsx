import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AssetRoutes from './routes';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter>
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>자산 관리 시스템</h1>
      <AssetRoutes />
    </div>
  </BrowserRouter>
);
