import { useState } from 'react'
import { Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function LoginPage() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await login(credentials)
            
            // Redirection basée sur le rôle de l'utilisateur
            if (response?.user?.role === 'EMPLOYER') {
                navigate('/employer/dashboard')
            } else if (response?.user?.role === 'EMPLOYEE') {
                navigate('/employee/dashboard')
            } else {
                navigate('/') // Redirection par défaut
            }
        } catch (err) {
            console.error('Login error:', err)
            
            // Gestion des erreurs spécifiques
            if (err.response) {
                if (err.response.status === 401) {
                    setError('Identifiants incorrects')
                } else if (err.response.status === 400) {
                    setError('Données de connexion invalides')
                } else {
                    setError('Erreur lors de la connexion')
                }
            } else if (err.request) {
                setError('Impossible de se connecter au serveur')
            } else {
                setError('Une erreur inattendue est survenue')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Card style={{ width: '450px' }} className="p-4 shadow">
                <Card.Body>
                    <div className="text-center mb-4">
                        <h2>Connexion</h2>
                        <p className="text-muted">Accédez à votre espace personnel</p>
                    </div>
                    
                    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nom d'utilisateur</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={credentials.username}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre nom d'utilisateur"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Mot de passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                                placeholder="Entrez votre mot de passe"
                            />
                        </Form.Group>
                        
                        <div className="d-grid gap-2 mb-3">
                            <Button 
                                variant="primary" 
                                type="submit" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                        <span className="ms-2">Connexion en cours...</span>
                                    </>
                                ) : 'Se connecter'}
                            </Button>
                        </div>
                        
                        <div className="text-center">
                            <Link to="/forgot-password" className="text-decoration-none">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                    </Form>
                    
                    <hr className="my-4" />
                    
                    <div className="text-center">
                        <span className="text-muted">Nouveau sur la plateforme ? </span>
                        <Link to="/register" className="text-decoration-none">
                            Créer un compte
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    )
}