import { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Alert,
  Container,
  Card,
  Row,
  Col,
} from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import api from '../../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PensionSimulator() {
  const { employee } = useOutletContext();

  const [formData, setFormData] = useState({
    retirement_date: '',
    salary_projection_rate: 2.5,
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Préremplir retirement_date (ex. +30 ans)
  useEffect(() => {
    if (employee?.hire_date) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 30);
      setFormData((prev) => ({
        ...prev,
        retirement_date: date.toISOString().split('T')[0],
      }));
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('employee/simulate/', formData);
      setResult(data);
      setError('');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.erreur ||
        'Erreur lors du calcul';
      setError(msg);
      setResult(null);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('simulation-result');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('simulation_pension.pdf');
  };

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-primary mb-4">Simulateur de Pension</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="g-4">
        {/* Formulaire */}
        <Col md={6}>
          <Card className="border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3 text-secondary">Paramètres de Simulation</h5>

            <p><strong>Date d’embauche :</strong> {employee?.hire_date}</p>
            <p><strong>Salaire actuel :</strong> {employee?.salary?.toLocaleString()} €</p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Date de départ à la retraite</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.retirement_date}
                  onChange={(e) =>
                    setFormData({ ...formData, retirement_date: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Taux de progression salariale annuel (%)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  value={formData.salary_projection_rate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      salary_projection_rate: parseFloat(e.target.value),
                    })
                  }
                  required
                />
              </Form.Group>

              <div className="d-grid">
                <Button variant="primary" type="submit" size="lg" className="rounded-pill">
                  Calculer ma pension
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        {/* Résultat */}
        <Col md={6}>
          <Card className="border-0 shadow-sm p-4" id="simulation-result">
            <h5 className="fw-bold mb-3 text-secondary">Résultat de la Simulation</h5>
            {result ? (
              <>
                <h4 className="text-center text-primary mb-3">
                  {result.monthly_pension} € / mois
                </h4>
                <hr />
                <p><strong>Salaire final projeté :</strong> {result.final_salary} €</p>
                <p><strong>Années de service :</strong> {result.years_of_service}</p>
                <p>
                  <strong>Âge de départ :</strong>{' '}
                  {new Date(formData.retirement_date).toLocaleDateString()}
                </p>
                <div className="d-grid mt-3">
                  <Button onClick={handleDownloadPDF} variant="outline-secondary" className="rounded-pill">
                    Télécharger PDF
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-muted">
                Entrez vos paramètres pour afficher une estimation.
              </p>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
