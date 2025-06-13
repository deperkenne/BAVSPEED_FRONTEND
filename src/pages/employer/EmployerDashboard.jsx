import { Container, Row, Col, Card } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'

export default function EmployerDashboard() {
    return (
        <Container fluid>
            <Row>
                <Col md={3} lg={2} className="bg-light sidebar">
                    <nav className="navbar navbar-expand navbar-light flex-column align-items-start">
                        <div className="sidebar-sticky pt-3 w-100">
                            <ul className="nav flex-column w-100">
                                <li className="nav-item">
                                    <Link to="/employer" className="nav-link">
                                        Paramètres entreprise
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/employer/employees" className="nav-link">
                                        Gestion des employés
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </Col>
                <Col md={9} lg={10} className="ml-sm-auto px-4 py-3">
                    <Outlet />
                </Col>
            </Row>
        </Container>
    )
}