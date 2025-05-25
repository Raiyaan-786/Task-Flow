import React from 'react';
import { Description, Email, Phone, LocationOn } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-col-span-1">
            <div className="footer-logo-container">
              <div className="footer-logo-icon">
                <Description className="footer-icon" />
              </div>
              <h1 className="footer-logo-text">TaskFlow</h1>
            </div>
            <p className="footer-description">
              Empowering CA firms with AI-powered office management solutions for the modern age.
            </p>
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <Email className="footer-contact-icon" />
                <span className="footer-contact-text">hello@taskflow.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+91 12345 67890</span>
              </div>
              <div className="footer-contact-item">
                <LocationOn className="footer-contact-icon" />
                <span className="footer-contact-text">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h2 className="footer-section-title">Product</h2>
            <ul className="footer-link-list">
              <li><a href="#features" className="footer-link">Features</a></li>
              <li><a href="#pricing" className="footer-link">Pricing</a></li>
              <li><a href="#" className="footer-link">Integrations</a></li>
              <li><a href="#" className="footer-link">API</a></li>
              <li><a href="#" className="footer-link">Security</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="footer-section-title">Resources</h2>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">Help Center</a></li>
              <li><a href="#" className="footer-link">Blog</a></li>
              <li><a href="#" className="footer-link">Tutorials</a></li>
              <li><a href="#" className="footer-link">Webinars</a></li>
              <li><a href="#" className="footer-link">Case Studies</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="footer-section-title">Company</h2>
            <ul className="footer-link-list">
              <li><a href="#" className="footer-link">About Us</a></li>
              <li><a href="#" className="footer-link">Careers</a></li>
              <li><a href="#" className="footer-link">Contact</a></li>
              <li><a href="#" className="footer-link">Partners</a></li>
              <li><a href="#" className="footer-link">Press</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-newsletter-section">
          <div className="footer-newsletter-container">
            <div className="footer-newsletter-text">
              <h3 className="footer-newsletter-title">Stay Updated</h3>
              <p className="footer-newsletter-description">
                Get the latest updates about TaskFlow features and CA industry insights.
              </p>
            </div>
            <div className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="footer-newsletter-input"
              />
              <button className="footer-newsletter-button">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-bottom-container">
            <span className="footer-copyright">
              © 2024 TaskFlow. All rights reserved.
            </span>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;