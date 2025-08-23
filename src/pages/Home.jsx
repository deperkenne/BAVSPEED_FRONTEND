import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white text-center py-5">
        <div className="container">
          <h1 className="display-5 fw-bold text-primary mb-3">
            {t('home.hero.title')}
          </h1>
          <p className="lead text-muted mb-4">
            {t('home.hero.subtitle')}
          </p>
          <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-4 shadow">
            {t('home.hero.cta')}
          </Link>
        </div>
      </section>

      {/* Avantages */}
      <section className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">{t('home.advantages.title')}</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold text-primary mb-2">{t('home.advantages.item1.title')}</h5>
                <p className="text-muted">{t('home.advantages.item1.desc')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold text-primary mb-2">{t('home.advantages.item2.title')}</h5>
                <p className="text-muted">{t('home.advantages.item2.desc')}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 p-4">
                <h5 className="fw-bold text-primary mb-2">{t('home.advantages.item3.title')}</h5>
                <p className="text-muted">{t('home.advantages.item3.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-white py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">{t('home.testimonials.title')}</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-5">
              <blockquote className="blockquote">
                <p className="mb-3 text-muted fst-italic">
                  {t('home.testimonials.item1.text')}
                </p>
                <footer className="blockquote-footer">{t('home.testimonials.item1.author')}</footer>
              </blockquote>
            </div>
            <div className="col-md-5">
              <blockquote className="blockquote">
                <p className="mb-3 text-muted fst-italic">
                  {t('home.testimonials.item2.text')}
                </p>
                <footer className="blockquote-footer">{t('home.testimonials.item2.author')}</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Final */}
      <section className="bg-light py-5 text-center">
        <div className="container">
          <h3 className="fw-bold mb-3">{t('home.cta_final.title')}</h3>
          <Link to="/register" className="btn btn-outline-primary btn-lg rounded-pill px-4">
            {t('home.cta_final.button')}
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
