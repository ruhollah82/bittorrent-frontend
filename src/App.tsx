import { useEffect } from 'react';
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
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App
