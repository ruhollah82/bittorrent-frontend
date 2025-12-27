import { useEffect } from 'react';
import { App as AntdApp } from 'antd';
import AppRouter from './router/AppRouter';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './theme';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication status on app start
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AntdApp>
          <NotificationProvider>
            <AppRouter />
          </NotificationProvider>
        </AntdApp>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
