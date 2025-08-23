import { useEffect, useState } from 'react';
import { Container, Table, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import { FaPlus, FaEye } from 'react-icons/fa';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get('/employees/');
        setEmployees(res.data);
      } catch (err) {
        setError("Impossible de charger les employés. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

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
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Liste des employés</h3>
          <Button variant="success" onClick={() => navigate('/employer/employees/add')}>
            <FaPlus className="me-2" />
            Ajouter un employé
          </Button>
        </div>

        {employees.length === 0 ? (
          <p className="text-muted">Aucun employé enregistré pour le moment.</p>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Sexe</th>
                <th>Date de naissance</th>
                <th>Date d’entrée</th>
                <th>Salaire</th>
                <th>Plan retraite</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.matricule}>
                  <td>{emp.first_name} {emp.last_name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.sexe === 'M' ? 'Homme' : 'Femme'}</td>
                  <td>{emp.date_naissance}</td>
                  <td>{emp.date_entree}</td>
                  <td>{emp.salaire} €</td>
                  <td>{emp.plan?.nom || emp.plan?.name || '—'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => navigate(`/employer/employees/${emp.matricule}`)}
                    >
                      <FaEye className="me-1" />
                      Voir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Container>
  );
}
