/* src/App.jsx */
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import AnimatedBackground from './components/layout/AnimatedBackground';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';

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
const ProtectedRoute = lazy(() => import('./components/auth/ProtectedRoute'));

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Rute Publik */}
      <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />

      {/* Rute Terlindungi */}
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><DashboardPage /></MainLayout></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><MainLayout><TransactionsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><MainLayout><AnalyticsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><MainLayout><BudgetPage /></MainLayout></ProtectedRoute>} />
      <Route path="/accounts" element={<ProtectedRoute><MainLayout><AccountsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/goals" element={<ProtectedRoute><MainLayout><GoalsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/recurring" element={<ProtectedRoute><MainLayout><RecurringPage /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

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