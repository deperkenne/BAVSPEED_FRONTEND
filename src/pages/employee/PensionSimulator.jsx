import { useState } from 'react'
import { Form, Button, Alert, Container, Card, Row, Col } from 'react-bootstrap'
import api from '../../api'
import { useAuth } from '../../contexts/AuthContext'

export default function PensionSimulator() {
    const { user } = useAuth()
    const [formData, setFormData] = useState({
        retirement_date: '',
        salary_projection_rate: 2.5
    })
    const [result, setResult] = useState(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/employee/simulate/', formData)
            setResult(data)
        } catch (err) {
            setError('Erreur lors du calcul')
        }
    }

    return (
        <Container className="mt-4">
            <h2>Simulateur de Pension</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mt-4">
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Paramètres de Simulation</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Date de départ à la retraite</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.retirement_date}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            retirement_date: e.target.value
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        Taux de progression salariale annuel (%)
                                    </Form.Label>
                                    <Form.Control
                                        type="number"
                                        step="0.1"
                                        value={formData.salary_projection_rate}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            salary_projection_rate: parseFloat(e.target.value)
                                        })}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Calculer ma pension
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card>
                        <Card.Header>Résultats de la Simulation</Card.Header>
                        <Card.Body>
                            {result ? (
                                <>
                                    <h4 className="text-center">
                                        {result.monthly_pension} € / MOIS
                                    </h4>
                                    <hr />
                                    <p><strong>Salaire final projeté:</strong> {result.final_salary} €</p>
                                    <p><strong>Années de service:</strong> {result.years_of_service}</p>
                                    <p><strong>Âge de départ:</strong> 
                                        {new Date(formData.retirement_date).toLocaleDateString()}
                                    </p>
                                </>
                            ) : (
                                <p className="text-muted">
                                    Entrez vos paramètres pour voir une estimation
                                </p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}