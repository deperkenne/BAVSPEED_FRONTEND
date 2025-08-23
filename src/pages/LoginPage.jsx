import { useState } from 'react';
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

export default function LoginPage() {
  const { t } = useTranslation();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login/', credentials);
      const { access, refresh, user } = res.data;

      // ✅ Enregistrer les tokens et infos utilisateur
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));

      console.log('✅ Utilisateur connecté :', user);

      // ✅ Redirection selon le rôle
      if (user.role === 'EMPLOYER') {
        navigate('/employer');
      } else if (user.role === 'EMPLOYEE') {
        navigate('/employee/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const message =
        err.response?.status === 400 || err.response?.status === 401
          ? t('login_page.error_login')
          : t('login_page.error_login');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '450px' }} className="p-4 shadow">
        <Card.Body>
          <div className="text-center mb-4">
            <h2>{t('login_page.title')}</h2>
            <p className="text-muted">{t('login_page.subtitle')}</p>
          </div>

          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t('login_page.email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                placeholder={t('login_page.email')}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t('login_page.password')}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                placeholder={t('login_page.password')}
              />
            </Form.Group>

            <div className="d-grid gap-2 mb-3">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" />
                    <span className="ms-2">{t('login_page.loading')}</span>
                  </>
                ) : t('login_page.submit_btn')}
              </Button>
            </div>

            <div className="text-center">
              <Link to="/forgot-password" className="text-decoration-none">
                {t('login_page.forgot_password')}
              </Link>
            </div>
          </Form>

          <hr className="my-4" />

          <div className="text-center">
            <span className="text-muted">{t('login_page.no_account')} </span>
            <Link to="/register" className="text-decoration-none">{t('login_page.go_to_register')}</Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
