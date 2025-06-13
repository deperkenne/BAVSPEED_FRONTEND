import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    // Rafraîchit le token si expiré
    const refreshToken = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token')
            const { data } = await api.post('/auth/token/refresh/', { refresh })
            localStorage.setItem('access_token', data.access)
            api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`
            return data.access
        } catch (err) {
            logout()
            return null
        }
    }

    // Vérifie l'utilisateur connecté au démarrage
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('access_token')
                if (token) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
                    const { data } = await api.get('/users/me/')
                    setUser(data)
                }
            } catch (error) {
                const newToken = await refreshToken()
                if (newToken) {
                    try {
                        const { data } = await api.get('/users/me/')
                        setUser(data)
                    } catch {
                        logout()
                    }
                }
            } finally {
                setLoading(false)
            }
        }
        checkAuth()
    }, [])

    // Connexion
    const login = async (credentials) => {
        const { data } = await api.post('/auth/login/', credentials)

        // Sauvegarde des tokens
        localStorage.setItem('access_token', data.access)
        localStorage.setItem('refresh_token', data.refresh)
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

        // Définir l'utilisateur (on récupère depuis data.user directement)
        setUser(data.user)

        // Redirection selon le rôle
        if (data.user.role === 'EMPLOYER') {
            navigate('/employer/dashboard')
        } else if (data.user.role === 'EMPLOYEE') {
            navigate('/employee/dashboard')
        } else {
            navigate('/')
        }
    }

    // Déconnexion
    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        delete api.defaults.headers.common['Authorization']
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
