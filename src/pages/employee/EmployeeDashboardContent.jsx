import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  return (
    <Container fluid>
      <Row>
        <Col md={3} lg={2} className="bg-light sidebar vh-100">
          <Nav className="flex-column pt-3">
            <Nav.Item>
              <Nav.Link as={Link} to="/employee">Tableau de Bord</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/employee/simulator">Simulateur</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/employee/contributions">Contributions</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col md={9} lg={10} className="px-4 py-3">
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
}
