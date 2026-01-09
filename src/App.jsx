import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
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

        {/* Placeholder for Data Entry Forms */}
        <Route path="/forms" element={<div>Contenido de Formularios (Próximamente)</div>} />

        {/* Admin only routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
              <div>Panel de Administración (Próximamente)</div>
            </ProtectedRoute>
          }
        />
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
