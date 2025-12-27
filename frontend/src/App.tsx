import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import InternshipsPage from './pages/internships/InternshipsPage';
import UsersPage from './pages/admin/UsersPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import CompaniesPage from './pages/companies/CompaniesPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute allowedRoles={['admin', 'sales', 'viewer']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/internships" element={<InternshipsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
