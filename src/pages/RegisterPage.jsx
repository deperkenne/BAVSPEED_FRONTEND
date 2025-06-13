import { useState } from 'react'
import { Form, Button, Alert, Container, Card, Tabs, Tab, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function RegisterPage() {
    const [activeTab, setActiveTab] = useState('employee')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Données du formulaire Employé
    const [employeeData, setEmployeeData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'EMPLOYEE',
        matricule: '',
        first_name: '', // Utilisez first_name au lieu de nom
        last_name: '',  // Utilisez last_name au lieu de prenom
        sexe: 'M',
        date_naissance: '',
        entreprise: '',
        date_entree: '',
        salaire: ''
    })

    // Données du formulaire Employeur
    const [employerData, setEmployerData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'EMPLOYER',
        company_name: '',
        company_siret: '',
        company_address: ''
    })

    const handleEmployeeChange = (e) => {
        const { name, value } = e.target
        setEmployeeData(prev => ({ ...prev, [name]: value }))
    }

    const handleEmployerChange = (e) => {
        const { name, value } = e.target
        setEmployerData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const formData = activeTab === 'employee' ? employeeData : employerData
        
        try {
            await api.post('/auth/register/', formData)
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.detail || "Erreur lors de l'inscription")
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '800px' }} className="p-4">
                <Card.Body>
                    <h2 className="text-center mb-4">Inscription</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                        {/* Onglet Employé */}
                        <Tab eventKey="employee" title="Employé">
                            <Form onSubmit={handleSubmit} className="mt-3">
                                <input type="hidden" name="role" value="EMPLOYEE" />
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom d'utilisateur</Form.Label>
                                            <Form.Control
                                                name="username"
                                                value={employeeData.username}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={employeeData.email}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Mot de passe</Form.Label>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={employeeData.password}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Numéro d'immatriculation</Form.Label>
                                            <Form.Control
                                                name="matricule"
                                                value={employeeData.matricule}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                name="nom"
                                                value={employeeData.nom}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Prénom</Form.Label>
                                            <Form.Control
                                                name="prenom"
                                                value={employeeData.prenom}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Sexe</Form.Label>
                                            <Form.Select
                                                name="sexe"
                                                value={employeeData.sexe}
                                                onChange={handleEmployeeChange}
                                                required
                                            >
                                                <option value="M">Masculin</option>
                                                <option value="F">Féminin</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Date de naissance</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name="date_naissance"
                                                value={employeeData.date_naissance}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom de l'entreprise</Form.Label>
                                            <Form.Control
                                                name="entreprise"
                                                value={employeeData.entreprise}
                                                onChange={handleEmployeeChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="lg">
                                        S'inscrire comme Employé
                                    </Button>
                                </div>
                            </Form>
                        </Tab>

                        {/* Onglet Employeur */}
                        <Tab eventKey="employer" title="Employeur">
                            <Form onSubmit={handleSubmit} className="mt-3">
                                <input type="hidden" name="role" value="EMPLOYER" />
                                
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom d'utilisateur</Form.Label>
                                            <Form.Control
                                                name="username"
                                                value={employerData.username}
                                                onChange={handleEmployerChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={employerData.email}
                                                onChange={handleEmployerChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mot de passe</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={employerData.password}
                                        onChange={handleEmployerChange}
                                        required
                                    />
                                </Form.Group>

                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nom de l'entreprise</Form.Label>
                                            <Form.Control
                                                name="company_name"
                                                value={employerData.company_name}
                                                onChange={handleEmployerChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>SIRET</Form.Label>
                                            <Form.Control
                                                name="company_siret"
                                                value={employerData.company_siret}
                                                onChange={handleEmployerChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label>Adresse de l'entreprise</Form.Label>
                                    <Form.Control
                                        name="company_address"
                                        value={employerData.company_address}
                                        onChange={handleEmployerChange}
                                        required
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit" size="lg">
                                        S'inscrire comme Employeur
                                    </Button>
                                </div>
                            </Form>
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Card>
        </Container>
    )
}