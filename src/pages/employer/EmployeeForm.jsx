import { useState, useEffect } from 'react';
import {
  Form, Button, Alert, Container, Card, Spinner, Row, Col
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function EmployeeForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    date_naissance: '',
    date_entree: '',
    sexe: 'HOMME',
    salaire: '',
    plan: '',
    password: '',         // ✅ Mot de passe par défaut
  });

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/plans/');
        setPlans(res.data);
      } catch {
        setError("Impossible de charger les plans de retraite.");
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/employees/', form);
      navigate('/employer/employees');
    } catch (err) {
      setError("Erreur lors de l’ajout de l’employé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow p-4">
        <h3 className="mb-4">Ajouter un nouvel employé</h3>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Plan retraite</Form.Label>
                <Form.Select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choisir un plan --</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>{plan.nom}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date d’entrée</Form.Label>
                <Form.Control
                  type="date"
                  name="date_entree"
                  value={form.date_entree}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sexe</Form.Label>
                <Form.Select name="sexe" value={form.sexe} onChange={handleChange}>
                  <option value="HOMME">Homme</option>
                  <option value="FEMME">Femme</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Salaire</Form.Label>
                <Form.Control
                  type="number"
                  name="salaire"
                  value={form.salaire}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mot de passe par défaut</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" animation="border" /> : "Ajouter l’employé"}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
