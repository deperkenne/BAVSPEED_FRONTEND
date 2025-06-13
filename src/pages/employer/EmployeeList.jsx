import { useState, useEffect } from 'react'
import { Table, Button, Container, Spinner, Alert, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import api from '../../api'

export default function EmployeeList() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const { data } = await api.get('/employees/')
                setEmployees(data)
            } catch (err) {
                setError('Erreur lors du chargement des employés')
            } finally {
                setLoading(false)
            }
        }
        fetchEmployees()
    }, [])


        const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        try {
            await api.post('/import-employees/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            // Recharger la liste
        } catch (err) {
            setError('Erreur lors de l\'import')
        }
    }

        // Ajouter dans le JSX :
        <div className="mb-3">
            <Form.Label>Import CSV</Form.Label>
            <Form.Control type="file" accept=".csv" onChange={handleFileUpload} />
        </div>

    const handleDelete = async (matricule) => {
        if (window.confirm('Supprimer cet employé ?')) {
            try {
                await api.delete(`/employees/${matricule}/`)
                setEmployees(employees.filter(e => e.matricule !== matricule))
            } catch (err) {
                setError('Erreur lors de la suppression')
            }
        }
    }

    if (loading) return <Spinner animation="border" />

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestion des employés</h2>
                <Button as={Link} to="/employer/employees/add" variant="success">
                    Ajouter un employé
                </Button>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Matricule</th>
                        <th>Nom</th>
                        <th>Salaire</th>
                        <th>Date d'embauche</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.matricule}>
                            <td>{employee.matricule}</td>
                            <td>{employee.user.first_name} {employee.user.last_name}</td>
                            <td>{employee.salary} €</td>
                            <td>{new Date(employee.hire_date).toLocaleDateString()}</td>
                            <td>
                                <Button 
                                    as={Link} 
                                    to={`/employer/employees/${employee.matricule}`}
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                >
                                    Éditer
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleDelete(employee.matricule)}
                                >
                                    Supprimer
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}