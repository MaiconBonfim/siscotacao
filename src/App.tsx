import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Car, FileText, AlertTriangle, LayoutDashboard, Users, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Policies from './pages/Policies';
import Claims from './pages/Claims';
import Clients from './pages/Clients';
import Login from './pages/Login';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AuthenticatedLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        items={[
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
          { icon: <Users size={20} />, label: 'Clientes', path: '/clients' },
          { icon: <Car size={20} />, label: 'Veículos', path: '/vehicles' },
          { icon: <FileText size={20} />, label: 'Apólices', path: '/policies' },
          { icon: <AlertTriangle size={20} />, label: 'Sinistros', path: '/claims' },
        ]}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white shadow-sm flex justify-end">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/claims" element={<Claims />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/*" element={
          <PrivateRoute>
            <AuthenticatedLayout />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}