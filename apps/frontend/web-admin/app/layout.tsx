import './global.css';
import { ThemeProvider } from '../components/providers/theme-provider';

export const metadata = {
  title: 'All-ERP 관리자',
  description: '통합 ERP 관리 시스템',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
