import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export default function EmployerDashboardContent() {
  // Données fictives (mock)
  const stats = {
    employees: 24,
    totalContributions: 1850000,
    nextDeadline: '31/08/2025',
    planStatus: 'Actif',
  };

  return (
    <div>
      <h3 className="mb-4 fw-bold text-primary">Tableau de bord</h3>
      <Row className="g-4">
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title>Employés</Card.Title>
              <h2>{stats.employees}</h2>
              <small className="text-muted">actifs dans votre entreprise</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title>Total cotisations</Card.Title>
              <h2>{stats.totalContributions.toLocaleString()} €</h2>
              <small className="text-muted">versées jusqu’à ce jour</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title>Prochaine échéance</Card.Title>
              <h2>{stats.nextDeadline}</h2>
              <small className="text-muted">date limite de cotisation</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 shadow-sm border-0">
            <Card.Body>
              <Card.Title>Plan entreprise</Card.Title>
              <h2>{stats.planStatus}</h2>
              <small className="text-muted">statut actuel</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
