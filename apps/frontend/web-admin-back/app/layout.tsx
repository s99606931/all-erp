import './global.css';

export const metadata = {
  title: 'All-ERP 관리자',
  description: '통합 ERP 관리 시스템',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
