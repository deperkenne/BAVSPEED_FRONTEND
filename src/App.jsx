import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout
import MainLayout from './layouts/MainLayout';

// Pages publiques
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Unauthorized from './pages/Unauthorized';

// Pages employeur
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerHomePage from './pages/employer/EmployerHomePage'; // ✅ AJOUT
import CompanySettings from './pages/employer/CompanySettings';
import EmployeeList from './pages/employer/EmployeeList';
import EmployeeForm from './pages/employer/EmployeeForm';
import EmployerDashboardContent from './pages/employer/EmployerDashboardContent';
import EmployeeDetail from './pages/employer/EmployeeDetail';

// Pages employé
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeDashboardContent from './pages/employee/EmployeeDashboardContent';
import PensionSimulator from './pages/employee/PensionSimulator';
import ContributionsHistory from './pages/employee/ContributionsHistory';
import EmployeeHome from './pages/employee/EmployeeHome';

// Sécurité
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<MainLayout><LoginPage /></MainLayout>} />
      <Route path="/register" element={<MainLayout><RegisterPage /></MainLayout>} />
      <Route path="/unauthorized" element={<MainLayout><Unauthorized /></MainLayout>} />
      <Route path="*" element={<MainLayout><Navigate to="/" /></MainLayout>} />

      {/* Routes protégées employeur */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYER']} />}>
        <Route path="/employer" element={<MainLayout><EmployerHomePage /></MainLayout>}>
          
          <Route path="company" element={<CompanySettings />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<EmployeeForm />} />
          <Route path="employees/:matricule" element={<EmployeeForm />} />
          <Route path="employees/:matricule" element={<EmployeeDetail />} />

        </Route>
      </Route>

      {/* Routes protégées employé */}
      <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
        <Route path="/employee" element={<MainLayout><EmployeeDashboard /></MainLayout>}>
          <Route index element={<EmployeeHome />} />
          <Route path="dashboard" element={<EmployeeHome />} />
          <Route path="simulator" element={<PensionSimulator />} />
          <Route path="contributions" element={<ContributionsHistory />} />
        </Route>
      </Route>

      {/* Redirection selon rôle */}
      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === 'EMPLOYER' ? (
              <Navigate to="/employer" replace />
            ) : (
              <Navigate to="/employee/dashboard" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}
