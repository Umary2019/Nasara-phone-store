import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ThemeToggle } from './components/layout/ThemeToggle.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import {
  LandingPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  DashboardPage,
  InventoryPage,
  ProductsPage,
  CategoriesPage,
  SalesPage,
  SalesHistoryPage,
  CustomersPage,
  SuppliersPage,
  PurchasesPage,
  ExpensesPage,
  ReportsPage,
  UsersPage,
  SettingsPage,
  AuditLogPage,
  ReceiptPreviewPage,
  NotFoundPage
} from './pages/index.jsx';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(user.roleName)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell><DashboardPage /></AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="/inventory" element={<ProtectedRoute><AppShell><InventoryPage /></AppShell></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><AppShell><ProductsPage /></AppShell></ProtectedRoute>} />
      <Route path="/categories" element={<ProtectedRoute><AppShell><CategoriesPage /></AppShell></ProtectedRoute>} />
      <Route path="/sales" element={<ProtectedRoute><AppShell><SalesPage /></AppShell></ProtectedRoute>} />
      <Route path="/sales-history" element={<ProtectedRoute><AppShell><SalesHistoryPage /></AppShell></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute><AppShell><CustomersPage /></AppShell></ProtectedRoute>} />
      <Route path="/suppliers" element={<ProtectedRoute><AppShell><SuppliersPage /></AppShell></ProtectedRoute>} />
      <Route path="/purchases" element={<ProtectedRoute><AppShell><PurchasesPage /></AppShell></ProtectedRoute>} />
      <Route path="/expenses" element={<ProtectedRoute><AppShell><ExpensesPage /></AppShell></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppShell><ReportsPage /></AppShell></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute roles={['admin']}><AppShell><UsersPage /></AppShell></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute roles={['admin']}><AppShell><SettingsPage /></AppShell></ProtectedRoute>} />
      <Route path="/audit-log" element={<ProtectedRoute roles={['admin']}><AppShell><AuditLogPage /></AppShell></ProtectedRoute>} />
      <Route path="/receipt/:id" element={<ProtectedRoute><AppShell><ReceiptPreviewPage /></AppShell></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}