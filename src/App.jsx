/* src/App.jsx */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import AnimatedBackground from './components/layout/AnimatedBackground';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

const LandingPage = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const TransactionsPage = lazy(() => import('./pages/Transactions'));
const AnalyticsPage = lazy(() => import('./pages/Analytics'));
const BudgetPage = lazy(() => import('./pages/Budget'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const AccountsPage = lazy(() => import('./pages/Accounts'));
const RecurringPage = lazy(() => import('./pages/Recurring'));
const GoalsPage = lazy(() => import('./pages/Goals'));

const AppRoutes = () => {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <MainLayout>
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/accounts" element={<AccountsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/recurring" element={<RecurringPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </ProtectedRoute>
      }/>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AnimatedBackground />
        <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { background: '#333', color: '#fff' } }} />
        <Suspense fallback={<LoadingSpinner />}>
          <AppRoutes />
        </Suspense>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;