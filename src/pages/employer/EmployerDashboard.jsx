import { Container, Row, Col } from 'react-bootstrap';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function EmployerDashboard() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <Container fluid className="min-vh-100">
      <Row className="flex-nowrap">
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-white border-end shadow-sm px-0">
          <nav className="d-flex flex-column vh-100 py-4 px-3">
            <h5 className="text-primary fw-bold mb-4">Espace Employeur</h5>
            <ul className="nav nav-pills flex-column gap-2">
              <li className="nav-item">
                <Link
                  to="/employer/company"
                  className={`nav-link ${isActive('/employer/company') ? 'active' : ''}`}
                >
                  Paramètres entreprise
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/employer/employees"
                  className={`nav-link ${isActive('/employer/employees') ? 'active' : ''}`}
                >
                  Gestion des employés
                </Link>
              </li>
            </ul>
          </nav>
        </Col>

        {/* Zone de contenu */}
        <Col md={9} lg={10} className="bg-light px-5 py-4">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
