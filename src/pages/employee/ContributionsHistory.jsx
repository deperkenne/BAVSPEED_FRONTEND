import { useState, useEffect } from 'react';
import {
  Table,
  Container,
  Spinner,
  Alert,
  Card,
  Badge,
} from 'react-bootstrap';
import api from '../../api';

export default function ContributionsHistory() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const { data } = await api.get('/employee/contributions/');
        setContributions(data);
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };
    fetchContributions();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-primary mb-4">Mes Contributions</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm p-4">
        <h5 className="fw-semibold text-secondary mb-3">Historique de mes versements</h5>

        {contributions.length === 0 ? (
          <Alert variant="info">Aucune contribution trouvée pour l’instant.</Alert>
        ) : (
          <Table responsive hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th className="text-end">Montant</th>
                <th>Année fiscale</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map((contribution) => (
                <tr key={contribution.id}>
                  <td>{new Date(contribution.date).toLocaleDateString()}</td>
                  <td className="text-end">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(contribution.amount)}
                  </td>
                  <td>{contribution.fiscal_year}</td>
                  <td>
                    <Badge bg={contribution.status === 'PAID' ? 'success' : 'secondary'}>
                      {contribution.status === 'PAID' ? 'Payé' : 'En attente'}
                    </Badge>
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
