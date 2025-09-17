import React, { useMemo, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navigation from './Navigation';
import { NotificationSystem } from '@/components/ui/notification-system';
import ClientOnly from '@/components/ClientOnly';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/styles/globals.css';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage }) => {
  const [mounted, setMounted] = useState(false);
  
  // Create QueryClient outside of any conditional logic
  const client = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
        // Disable queries during SSR to prevent hydration mismatches
        enabled: typeof window !== 'undefined',
      },
    },
  }), []);

  useEffect(() => {
    // Simple mounting check without Zustand
    setMounted(true);
  }, []);

  // Render loading state while waiting for hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <div className="h-5 w-5 bg-primary-foreground rounded"></div>
                </div>
                <div>
                  <h1 className="text-lg font-bold">GH BOT Admin</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:pl-64">
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={client}>
        <div className="min-h-screen bg-background">
          <ClientOnly fallback={
            <div className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between h-16 px-6 border-b">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                      <div className="h-5 w-5 bg-primary-foreground rounded"></div>
                    </div>
                    <div>
                      <h1 className="text-lg font-bold">GH BOT Admin</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }>
            <ErrorBoundary>
              <Navigation currentPage={currentPage} />
            </ErrorBoundary>
          </ClientOnly>
          
          {/* Main content */}
          <div className="lg:pl-64">
            <main className="p-6">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </div>

          {/* Notification System */}
          <ClientOnly>
            <ErrorBoundary fallback={<div></div>}>
              <NotificationSystem />
            </ErrorBoundary>
          </ClientOnly>
        </div>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export { MainLayout };
export default MainLayout;
