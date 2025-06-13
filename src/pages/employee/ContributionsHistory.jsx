import { useState, useEffect } from 'react'
import { Table, Container, Spinner, Alert } from 'react-bootstrap'
import api from '../../api'

export default function ContributionsHistory() {
    const [contributions, setContributions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const { data } = await api.get('/employee/contributions/')
                setContributions(data)
            } catch (err) {
                setError('Erreur lors du chargement')
            } finally {
                setLoading(false)
            }
        }
        fetchContributions()
    }, [])

    if (loading) return <Spinner animation="border" />

    return (
        <Container className="mt-4">
            <h2>Historique de mes Contributions</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}

            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Montant</th>
                        <th>Année fiscale</th>
                    </tr>
                </thead>
                <tbody>
                    {contributions.map(contribution => (
                        <tr key={contribution.id}>
                            <td>{new Date(contribution.date).toLocaleDateString()}</td>
                            <td>{contribution.amount} €</td>
                            <td>{contribution.fiscal_year}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}