import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
            <p className="mb-0">&copy; {new Date().getFullYear()} BavSpeeD. {t('footer.rights')}</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <a href="/privacy" className="text-light me-3 text-decoration-none">{t('footer.privacy')}</a>
            <a href="/terms" className="text-light text-decoration-none">{t('footer.terms')}</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
