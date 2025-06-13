import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/login" />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />
    }

    return <Outlet />
}