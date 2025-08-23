import { useState, useEffect } from 'react';
import {
  Card,
  Container,
  Spinner,
  Row,
  Col,
  Nav,
  Alert
} from 'react-bootstrap';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function EmployeeDashboard() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/users/me/');
        setEmployee(data);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.response?.data?.detail || 'Erreur de chargement des données');

        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, logout]);

  const isActive = (path) => location.pathname.startsWith(path);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Aucune donnée d'employé disponible
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="flex-nowrap">
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-white border-end shadow-sm px-0">
          <nav className="d-flex flex-column vh-100 py-4 px-3">
            <h5 className="text-primary fw-bold mb-4">Espace Employé</h5>
            <Nav className="flex-column gap-2">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/employee/dashboard"
                  active={isActive('/employee/dashboard')}
                >
                  Tableau de Bord
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/employee/simulator"
                  active={isActive('/employee/simulator')}
                >
                  Simulateur
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/employee/contributions"
                  active={isActive('/employee/contributions')}
                >
                  Contributions
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </nav>
        </Col>

        {/* Contenu principal */}
        <Col md={9} lg={10} className="px-5 py-4 bg-light">
          <Outlet context={{ employee }} />

          {(location.pathname === '/employee' || location.pathname === '/employee/dashboard') && (
            <Row className="mt-4">
              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-white fw-semibold border-bottom">
                    Mes Informations
                  </Card.Header>
                  <Card.Body>
                    <p><strong>Matricule :</strong> {employee.matricule}</p>
                    <p><strong>Nom :</strong> {employee.user?.first_name} {employee.user?.last_name}</p>
                    <p>
                      <strong>Date d'embauche :</strong>{" "}
                      {employee.hire_date
                        ? new Date(employee.hire_date).toLocaleDateString()
                        : "Non renseignée"}
                    </p>
                    <p>
                      <strong>Salaire actuel :</strong>{" "}
                      {employee.salary !== undefined && employee.salary !== null
                        ? employee.salary.toLocaleString() + " €"
                        : "Non renseigné"}
                    </p>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="mb-4 border-0 shadow-sm">
                  <Card.Header className="bg-white fw-semibold border-bottom">
                    Estimation Actuelle
                  </Card.Header>
                  <Card.Body>
                    <h4 className="text-center text-primary mb-3">450 € / mois</h4>
                    <hr />
                    <p><strong>Cotisations cumulées :</strong> 25 000 €</p>
                    <p><strong>Âge de départ :</strong> 67 ans</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}
