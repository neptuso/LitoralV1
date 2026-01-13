import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import FormsPage from './pages/forms/FormsPage';
import { USER_ROLES } from './config';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Data Entry Forms */}
        <Route path="/forms" element={<FormsPage />} />

        {/* Admin only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
