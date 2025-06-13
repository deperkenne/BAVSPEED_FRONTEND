import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import CompanySettings from './pages/employer/CompanySettings'
import EmployeeList from './pages/employer/EmployeeList'
import EmployeeForm from './pages/employer/EmployeeForm'
import EmployeeDashboardContent from './pages/employee/EmployeeDashboardContent'
import PensionSimulator from './pages/employee/PensionSimulator'
import ContributionsHistory from './pages/employee/ContributionsHistory'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
    const { user } = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
                <Route 
                    path="/employer/*" 
                    element={<EmployerDashboard />} 
                    allowedRoles={['EMPLOYER']}
                />
                <Route 
                    path="/employee/*" 
                    element={<EmployeeDashboard />} 
                    allowedRoles={['EMPLOYEE']}
                />
                <Route path="/" element={user?.role === 'EMPLOYER' 
                    ? <EmployerDashboard /> 
                    : <EmployeeDashboard />} 
                />
            </Route>
            <Route path="/employer" element={<EmployerDashboard />}>
                <Route index element={<CompanySettings />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/add" element={<EmployeeForm />} />
                <Route path="employees/:matricule" element={<EmployeeForm />} />
          </Route>

                <Route path="/employee" element={<EmployeeDashboard />}>
                    <Route index element={<EmployeeDashboardContent />} />
                    <Route path="simulator" element={<PensionSimulator />} />
                    <Route path="contributions" element={<ContributionsHistory />} />
                </Route>
        </Routes>
    )
}