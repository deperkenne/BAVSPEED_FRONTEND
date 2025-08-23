import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

// Création du contexte
const AuthContext = createContext();

// Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔓 Déconnexion (déclaré avant refreshToken)
  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // 🔁 Rafraîchit le token
  const refreshToken = useCallback(async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) throw new Error('No refresh token');

      const { data } = await api.post('/auth/token/refresh/', { refresh });
      localStorage.setItem('access_token', data.access);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      return data.access;
    } catch (err) {
      logout(); // maintenant logout est défini au bon endroit
      return null;
    }
  }, [logout]);

  // 🔐 Connexion
  const login = useCallback(
    async (credentials) => {
      try {
        const { data: tokens } = await api.post('/auth/login/', credentials);
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;

        const { data: user } = await api.get('/users/me/');
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.role === 'EMPLOYER') {
          navigate('/employer/dashboard');
        } else if (user.role === 'EMPLOYEE') {
          navigate('/employee/dashboard');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Login error:', err.response?.data);
        throw err;
      }
    },
    [navigate]
  );

  // 🧠 Vérification de session au démarrage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const { data } = await api.get('/users/me/');
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        }
      } catch (error) {
        const newToken = await refreshToken();
        if (newToken) {
          try {
            const { data } = await api.get('/users/me/');
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } catch {
            logout();
          }
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [refreshToken, logout]);

  // 🕓 Rafraîchissement automatique
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('access_token');
    if (!token) return;

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const exp = decoded.exp * 1000;
    const timeout = exp - Date.now() - 60_000;

    if (timeout > 0) {
      const timer = setTimeout(() => {
        refreshToken();
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [user, refreshToken]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      logout,
      loading,
      refreshToken,
    }),
    [user, login, logout, loading, refreshToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
