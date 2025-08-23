import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Alert, Image, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import {
  FaBuilding,
  FaIdBadge,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaPlusCircle,
  FaUsers,
  FaCog,
  FaEdit
} from 'react-icons/fa';

export default function EmployerHomePage() {
  const { t } = useTranslation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await api.get('/users/me/');
        if (res.data.role !== 'EMPLOYER') {
          navigate('/unauthorized');
          return;
        }
        setCompany(res.data.company);
      } catch (err) {
        setError('Erreur lors du chargement des informations.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [navigate]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Card className="shadow-lg border-0">
        <Row className="g-0">
          <Col md={4} className="bg-light d-flex align-items-center justify-content-center p-4">
            {company?.logo ? (
              <Image
                src={company.logo}
                alt="Logo entreprise"
                fluid
                rounded
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
            ) : (
              <div className="text-muted text-center">Aucun logo</div>
            )}
          </Col>
          <Col md={8}>
            <Card.Body className="p-5">
              <h2 className="text-primary mb-3">
                👋 Bienvenue, <strong>{company?.name || 'Entreprise'}</strong>
              </h2>
              <p className="text-muted mb-4">
                Voici les informations de votre entreprise enregistrée dans le système.
              </p>

              <Row className="mb-3">
                <Col md={6} className="mb-3">
                  <FaBuilding className="me-2 text-secondary" />
                  <strong>Nom :</strong> {company?.name}
                </Col>
                <Col md={6} className="mb-3">
                  <FaIdBadge className="me-2 text-secondary" />
                  <strong>SIRET :</strong> {company?.siret}
                </Col>
                <Col md={6} className="mb-3">
                  <FaMapMarkerAlt className="me-2 text-secondary" />
                  <strong>Adresse :</strong> {company?.address}
                </Col>
                <Col md={6} className="mb-3">
                  <FaCalendarAlt className="me-2 text-secondary" />
                  <strong>Créée le :</strong>{' '}
                  {company?.created_at ? new Date(company.created_at).toLocaleDateString() : '-'}
                </Col>
              </Row>

              <hr />

              <div className="d-flex gap-3 flex-wrap mt-4">
                <Button variant="outline-primary" onClick={() => navigate('/employer/employees/add')}>
                  <FaPlusCircle className="me-2" />
                  Ajouter un employé
                </Button>
                <Button variant="outline-success" onClick={() => navigate('/employer/employees')}>
                  <FaUsers className="me-2" />
                  Voir les employés
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/employer/company')}>
                  <FaEdit className="me-2" />
                  Modifier les infos
                </Button>
                <Button variant="outline-dark" onClick={() => navigate('/employer/plans')}>
                  <FaCog className="me-2" />
                  Gérer les plans de retraite
                </Button>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
      <Outlet />
    </Container>
  );
}
