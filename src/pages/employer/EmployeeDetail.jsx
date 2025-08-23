import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
import api from '../../api';

export default function EmployeeDetail() {
  const { matricule } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await api.get(`/employer/employees/${matricule}/`);
        setEmployee(res.data);
      } catch (err) {
        setError("Impossible de charger les informations de l’employé.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [matricule]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h3 className="mb-4">Détail de l'employé</h3>

        <Row className="mb-3">
          <Col md={6}><strong>Nom :</strong> {employee?.user?.last_name}</Col>
          <Col md={6}><strong>Prénom :</strong> {employee?.user?.first_name}</Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}><strong>Email :</strong> {employee?.user?.email}</Col>
          <Col md={6}><strong>Sexe :</strong> {employee?.sexe}</Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}><strong>Date de naissance :</strong> {employee?.date_naissance}</Col>
          <Col md={6}><strong>Date d’entrée :</strong> {employee?.hire_date}</Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}><strong>Salaire :</strong> {employee?.salary} €</Col>
          <Col md={6}><strong>Matricule :</strong> {employee?.matricule}</Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <strong>Plan retraite :</strong> {employee?.plan_retraite?.name || 'Non défini'}
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={() => navigate(-1)}>Retour</Button>
        </div>
      </Card>
    </Container>
  );
}
