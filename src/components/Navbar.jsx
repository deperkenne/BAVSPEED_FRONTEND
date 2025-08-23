import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Bav<span style={{ color: '#06a0c4' }}>Speed</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav gap-3 align-items-center">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/">
                {t('welcome')}
              </Link>
            </li>

            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/register') ? 'active' : ''}`} to="/register">
                    {t('register')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">
                    {t('login')}
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    {t('dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger btn-sm" onClick={logout}>
                    {t('logout')}
                  </button>
                </li>
              </>
            )}

            <li className="nav-item">
              <LanguageSelector />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
