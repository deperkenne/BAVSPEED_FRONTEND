import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../../api';

export default function EmployeeHome() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('dashboard/'); // Assure-toi que ce endpoint existe dans ton backend
        setStats(data);
      } catch (err) {
        console.error('Erreur chargement stats employé :', err);
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de votre tableau de bord...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          {error || "Une erreur est survenue."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-primary mb-4">Mon Tableau de Bord</h2>

      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 text-center">
            <h5 className="text-secondary mb-2">Salaire actuel</h5>
            <h3 className="fw-bold text-success">
              {stats.salary?.toLocaleString()} €
            </h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 text-center">
            <h5 className="text-secondary mb-2">Total cotisé</h5>
            <h3 className="fw-bold text-primary">
              {stats.totalContributions?.toLocaleString()} €
            </h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 text-center">
            <h5 className="text-secondary mb-2">Années de service</h5>
            <h3 className="fw-bold text-dark">
              {stats.yearsOfService} ans
            </h3>
          </Card>
        </Col>
      </Row>

      <Card className="p-4 shadow-sm border-0">
        <h5 className="text-secondary fw-semibold mb-3">
          Projection salariale (hypothèse)
        </h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.salaryProjection || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={['auto', 'auto']} tickFormatter={(v) => `${v}€`} />
            <Tooltip formatter={(value) => `${value} €`} />
            <Line
              type="monotone"
              dataKey="salary"
              stroke="#0d6efd"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Container>
  );
}
