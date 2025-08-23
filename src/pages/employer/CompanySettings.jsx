import { useState, useEffect } from 'react';
import {
  Form,
  Button,
  Alert,
  Container,
  Spinner,
  Card,
  Image,
} from 'react-bootstrap';
import api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function CompanySettings() {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get('/company/');
        setCompany(data);
        if (data.logo) setLogoPreview(data.logo);
      } catch (err) {
        setError("Erreur lors du chargement des informations");
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!company) return;

    const formData = new FormData();
    formData.append('name', company.name);
    formData.append('address', company.address || '');
    if (logoFile) {
      formData.append('logo', logoFile);
    }

    setSaving(true);
    try {
      await api.patch('/company/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Modifications enregistrées avec succès');
      setError('');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
      setSuccess('');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user || user.role !== 'EMPLOYER') {
    return (
      <Container className="py-4 text-center">
        <Alert variant="danger">Accès non autorisé</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="fw-bold text-primary mb-4">Modifier les informations de l’entreprise</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="p-4 border-0 shadow-sm">
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Form.Group className="mb-3">
            <Form.Label>Nom de l'entreprise</Form.Label>
            <Form.Control
              type="text"
              value={company?.name || ''}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              value={company?.address || ''}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>SIRET</Form.Label>
            <Form.Control
              type="text"
              value={company?.siret || ''}
              readOnly
              plaintext
              className="bg-light border rounded"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Logo actuel</Form.Label>
            <div className="mb-2">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  fluid
                  rounded
                  style={{ maxHeight: '120px', objectFit: 'contain' }}
                />
              ) : (
                <div className="text-muted">Aucun logo enregistré</div>
              )}
            </div>
            <Form.Control type="file" accept="image/*" onChange={handleLogoChange} />
          </Form.Group>

          <div className="d-grid">
            <Button
              variant="primary"
              type="submit"
              size="lg"
              className="rounded-pill"
              disabled={saving}
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
