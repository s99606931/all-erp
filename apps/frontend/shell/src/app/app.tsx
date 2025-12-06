

import { Route, Routes } from 'react-router-dom';
import { ShellLayout } from '@all-erp/ui-design';
import { Home, Settings, Users, FileText, Database } from 'lucide-react';

export function App() {
  const links = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'HR Management', href: '/hr', icon: Users },
    { name: 'Finance', href: '/finance', icon: FileText },
    { name: 'System', href: '/system', icon: Database },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ShellLayout
            links={links}
            user={{ name: 'Admin User', email: 'admin@erp.com' }}
            onLogout={() => alert('Logout')}
          />
        }
      >
        <Route index element={<div className="p-4"><h1>Welcome to All-ERP Dashboard</h1></div>} />
        <Route path="hr/*" element={<div className="p-4">HR Module Placeholder</div>} />
        <Route path="finance/*" element={<div className="p-4">Finance Module Placeholder</div>} />
        <Route path="system/*" element={<div className="p-4">System Module Placeholder</div>} />
        <Route path="settings" element={<div className="p-4">Settings Page</div>} />
      </Route>
    </Routes>
  );
}

export default App;
