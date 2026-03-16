import './globals.css';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import { headers } from 'next/headers';

export const metadata = {
  title: 'StudyHero AI | Your Smart Learning Companion',
  description: 'AI-powered learning platform that transforms notes into interactive study materials, quizzes, and predicted exams.',
};

export default function RootLayout({ children }) {
  const headersList = headers();
  const rawPath = headersList.get('x-invoke-path') || '';
  // Next.js app router workaround to get current path for server components
  const pathname = typeof window !== 'undefined' ? window.location.pathname : rawPath;

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="app-layout" style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <div className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 'var(--sidebar-width)', transition: 'margin-left 0.3s ease' }}>
            <TopNav pathname={pathname} />
            <main className="main-content-inner" style={{ flex: 1, paddingTop: 'var(--topnav-height)' }}>
              {children}
            </main>
            <Footer />
          </div>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)'
            },
            success: {
              iconTheme: { primary: 'var(--green)', secondary: 'white' }
            }
          }}
        />
      </body>
    </html>
  );
}
