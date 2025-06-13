import { useState, useEffect } from 'react'
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap'
import api from '../../api'
import { useAuth } from '../../contexts/AuthContext'

export default function CompanySettings() {
    const { user } = useAuth()
    const [company, setCompany] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const { data } = await api.get('/company/')
                setCompany(data)
            } catch (err) {
                setError('Erreur lors du chargement des informations')
            } finally {
                setLoading(false)
            }
        }
        fetchCompany()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await api.patch('/company/', company)
            setSuccess('Modifications enregistrées avec succès')
        } catch (err) {
            setError('Erreur lors de la mise à jour')
        }
    }

    if (loading) return <Spinner animation="border" />

    return (
        <Container className="mt-4">
            <h2>Paramètres de l'entreprise</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nom de l'entreprise</Form.Label>
                    <Form.Control
                        type="text"
                        value={company?.name || ''}
                        onChange={(e) => setCompany({...company, name: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>SIRET</Form.Label>
                    <Form.Control
                        type="text"
                        value={company?.siret || ''}
                        readOnly
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Enregistrer
                </Button>
            </Form>
        </Container>
    )
}