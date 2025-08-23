import { useState } from 'react';
import {
  Form, Button, Alert, Container, Card, Row, Col
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [error, setError] = useState('');
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
    company_siret: '',
    company_address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const payload = new FormData();

    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('role', 'EMPLOYER'); // Champ requis
    payload.append('company_name', formData.company_name);
    payload.append('company_siret', formData.company_siret);
    payload.append('company_address', formData.company_address);
    if (logo) {
      payload.append('company_logo', logo); // ⚠️ Nom exact attendu par le backend
    }

    try {
      await api.post('/auth/register/', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/login');
    } catch (err) {
      const detail =
        typeof err.response?.data === 'object'
          ? Object.values(err.response.data).flat().join(', ')
          : err.response?.data?.detail || t('register_page.error_register');
      setError(detail);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card className="p-4 shadow-sm border-0 w-100" style={{ maxWidth: '700px' }}>
        <Card.Body>
          <h2 className="text-center fw-bold text-primary mb-4">{t('register_page.create_account')}</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit} className="mt-3">
            <Row className="g-3">
              <Col md={6}><Form.Group>
                <Form.Label>{t('register_page.email')}</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group></Col>

              <Col md={6}><Form.Group>
                <Form.Label>{t('register_page.password')}</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
              </Form.Group></Col>

              <Col md={6}><Form.Group>
                <Form.Label>{t('register_page.company_name')}</Form.Label>
                <Form.Control name="company_name" value={formData.company_name} onChange={handleChange} required />
              </Form.Group></Col>

              <Col md={6}><Form.Group>
                <Form.Label>{t('register_page.siret')}</Form.Label>
                <Form.Control name="company_siret" value={formData.company_siret} onChange={handleChange} required />
              </Form.Group></Col>

              <Col md={12}><Form.Group>
                <Form.Label>{t('register_page.company_address')}</Form.Label>
                <Form.Control name="company_address" value={formData.company_address} onChange={handleChange} required />
              </Form.Group></Col>

              <Col md={12}><Form.Group>
                <Form.Label>{t('register_page.logo')}</Form.Label>
                <Form.Control type="file" name="company_logo" onChange={handleLogoChange} accept="image/*" />
              </Form.Group></Col>
            </Row>

            <div className="d-grid mt-4">
              <Button type="submit" size="lg" className="rounded-pill">
                {t('register_page.employer_register_btn')}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
