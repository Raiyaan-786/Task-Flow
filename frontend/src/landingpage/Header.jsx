import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      <div className="header-container">
        <div className="flex-container">
          <div className="logo-container">
            <div className="logo-icon">
              <img src="logoicon.svg" alt="TaskFlow Logo" />
            </div>
            <h1 className="logo-text">TaskFlow</h1>
          </div>

          <nav className="desktop-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
          </nav>

          <div className="cta-buttons">
            <Link to="/tenantlogin">
              <button className="button-ghost">Login</button>
            </Link>
            <Link to="/tenantsignup">
              <button className="button-contained">Get Started Free</button>
            </Link>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <nav className="mobile-nav">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#pricing">Pricing</a>
            <a href="#testimonials">Reviews</a>
            <div className="mobile-cta">
              <Link to="/login">
                <button className="button-ghost">Login</button>
              </Link>
              <Link to="/signup">
                <button className="button-contained">Get Started Free</button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;