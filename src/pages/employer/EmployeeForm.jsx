import { useState, useEffect } from 'react'
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api'

export default function EmployeeForm() {
    const { matricule } = useParams()
    const [employee, setEmployee] = useState({
        matricule: '',
        salary: '',
        hire_date: '',
        user: {
            username: '',
            first_name: '',
            last_name: '',
            email: '',
            password: ''
        }
    })
    const [loading, setLoading] = useState(!!matricule)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if (matricule) {
            const fetchEmployee = async () => {
                try {
                    const { data } = await api.get(`/employees/${matricule}/`)
                    setEmployee(data)
                } catch (err) {
                    setError('Erreur lors du chargement')
                } finally {
                    setLoading(false)
                }
            }
            fetchEmployee()
        }
    }, [matricule])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (matricule) {
                await api.patch(`/employees/${matricule}/`, employee)
            } else {
                await api.post('/employees/', employee)
            }
            navigate('/employer/employees')
        } catch (err) {
            setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde')
        }
    }

    if (loading) return <Spinner animation="border" />

    return (
        <Container className="mt-4">
            <h2>{matricule ? 'Modifier' : 'Ajouter'} un employé</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <h4 className="mt-4">Informations personnelles</h4>
                <Form.Group className="mb-3">
                    <Form.Label>Nom d'utilisateur</Form.Label>
                    <Form.Control
                        type="text"
                        value={employee.user.username}
                        onChange={(e) => setEmployee({
                            ...employee,
                            user: {...employee.user, username: e.target.value}
                        })}
                        required
                        disabled={!!matricule}
                    />
                </Form.Group>

                {/* Ajouter les autres champs de formulaire */}

                <h4 className="mt-4">Informations professionnelles</h4>
                <Form.Group className="mb-3">
                    <Form.Label>Matricule</Form.Label>
                    <Form.Control
                        type="text"
                        value={employee.matricule}
                        onChange={(e) => setEmployee({
                            ...employee,
                            matricule: e.target.value
                        })}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Sauvegarder
                </Button>
            </Form>
        </Container>
    )
}