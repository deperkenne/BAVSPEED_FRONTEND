import { useState, useEffect } from 'react'
import { Card, Container, Spinner, Row, Col } from 'react-bootstrap'
import api from '../../api'
import { Nav } from 'react-bootstrap'
import { Outlet, Link } from 'react-router-dom'


export default function EmployeeDashboard() {
    const [employee, setEmployee] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/employee/dashboard/')
                setEmployee(data)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return <Spinner animation="border" />

    return (
        <Container className="mt-4">
            <h2>Mon Tableau de Bord</h2>
            <Row>
                <Col md={3} lg={2} className="bg-light sidebar">
                    <Nav className="flex-column pt-3">
                        <Nav.Item>
                            <Nav.Link as={Link} to="/employee">Tableau de Bord</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/employee/simulator">Simulateur</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link as={Link} to="/employee/contributions">Contributions</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col md={9} lg={10} className="px-4 py-3">
                    <Outlet />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>Mes Informations</Card.Header>
                        <Card.Body>
                            <p><strong>Matricule:</strong> {employee.matricule}</p>
                            <p><strong>Nom:</strong> {employee.user.first_name} {employee.user.last_name}</p>
                            <p><strong>Date d'embauche:</strong> {new Date(employee.hire_date).toLocaleDateString()}</p>
                            <p><strong>Salaire actuel:</strong> {employee.salary} €</p>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={6}>
                    <Card>
                        <Card.Header>Estimation Actuelle</Card.Header>
                        <Card.Body>
                            <h4 className="text-center">450 € / MOIS</h4>
                            <hr />
                            <p><strong>Cotisations cumulées:</strong> 25 000 €</p>
                            <p><strong>Âge de départ:</strong> 67 ans</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}