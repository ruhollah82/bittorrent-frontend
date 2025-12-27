import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuthStore } from '../stores/authStore';
import { useEffect } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Main Pages
import Dashboard from '../pages/Dashboard';
import TorrentList from '../pages/torrents/TorrentList';
import TorrentDetail from '../pages/torrents/TorrentDetail';
import TorrentUpload from '../pages/torrents/TorrentUpload';
import MyTorrents from '../pages/torrents/MyTorrents';

// User Pages
import Profile from '../pages/users/Profile';
import UserStats from '../pages/users/UserStats';

// Credit Pages
import CreditDashboard from '../pages/credits/CreditDashboard';
import Transactions from '../pages/credits/Transactions';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import SystemConfig from '../pages/admin/SystemConfig';
import InviteCodes from '../pages/admin/InviteCodes';

// Security Pages
import SecurityDashboard from '../pages/security/SecurityDashboard';
import SuspiciousActivities from '../pages/security/SuspiciousActivities';
import IPBlocks from '../pages/security/IPBlocks';

// Logging Pages
import SystemLogs from '../pages/logs/SystemLogs';
import UserActivities from '../pages/logs/UserActivities';
import SystemStats from '../pages/logs/SystemStats';

// Error Pages
import NotFound from '../pages/NotFound';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, checkAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.is_staff && !user?.is_superuser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Torrent Routes */}
        <Route
          path="/torrents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TorrentList />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/torrents/:infoHash"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TorrentDetail />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/torrents/upload"
          element={
            <ProtectedRoute>
              <MainLayout>
                <TorrentUpload />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-torrents"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyTorrents />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserStats />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Credit Routes */}
        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreditDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/credits/transactions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <AdminDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <UserManagement />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/config"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <SystemConfig />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invites"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <InviteCodes />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Security Routes */}
        <Route
          path="/admin/security"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <SecurityDashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/security/activities"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <SuspiciousActivities />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/security/ip-blocks"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <IPBlocks />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Logging Routes */}
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <SystemLogs />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs/activities"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <UserActivities />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs/stats"
          element={
            <ProtectedRoute requireAdmin>
              <MainLayout>
                <SystemStats />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch all route */}
        <Route
          path="*"
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
