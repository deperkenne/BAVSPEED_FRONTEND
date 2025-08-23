import axios from 'axios';

// 🌐 Création de l’instance Axios avec configuration globale
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://www.bavspeed.de/api/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 🌍 Détection de la langue de l'utilisateur
const lang = localStorage.getItem('lang') || 'fr';
api.defaults.headers.common['Accept-Language'] = lang;

// 🔐 Intercepteur : injection automatique du token JWT dans les requêtes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Intercepteur : tentative automatique de rafraîchissement du token expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Cas d’un token expiré
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(
          `${api.defaults.baseURL}auth/token/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        const newAccessToken = res.data.access;
        localStorage.setItem('access_token', newAccessToken);

        // Met à jour l’en-tête Authorization
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Rejoue la requête initiale avec le nouveau token
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token :', refreshError);
        clearSession();
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    // 🎯 Gestion des erreurs 400 – messages personnalisés
    if (error.response?.status === 400) {
      if (error.response.data?.non_field_errors) {
        error.message = error.response.data.non_field_errors.join(', ');
      } else if (error.response.data?.detail) {
        error.message = error.response.data.detail;
      }
    }

    return Promise.reject(error);
  }
);

// 🧼 Nettoyage du stockage local en cas de déconnexion ou d’expiration
function clearSession() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}

// 🔁 Redirection centralisée vers la page de connexion
function redirectToLogin() {
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login?session_expired=1';
  }
}

export default api;
