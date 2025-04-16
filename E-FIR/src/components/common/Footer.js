import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="mb-3 mb-md-0">
            <h6>E-FIR - Advanced FIR Management Platform</h6>
            <p className="text-muted small mb-0">
              Streamlining the FIR process for citizens and police departments
            </p>
          </Col>
          <Col md={3} className="mb-3 mb-md-0">
            <h6>Quick Links</h6>
            <ul className="list-unstyled small">
              <li><a href="/" className="text-decoration-none text-muted">Home</a></li>
              <li><a href="/about" className="text-decoration-none text-muted">About</a></li>
              <li><a href="/contact" className="text-decoration-none text-muted">Contact</a></li>
              <li><a href="/help" className="text-decoration-none text-muted">Help & Support</a></li>
            </ul>
          </Col>
          <Col md={3}>
            <h6>Contact Us</h6>
            <ul className="list-unstyled small text-muted">
              <li><i className="fas fa-phone-alt me-2"></i> Emergency: 100</li>
              <li><i className="fas fa-envelope me-2"></i> support@efir.gov.in</li>
              <li><i className="fas fa-map-marker-alt me-2"></i> Police Headquarters</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-3 opacity-25" />
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="text-muted small mb-2 mb-md-0">
            &copy; {currentYear} E-FIR. All rights reserved.
          </p>
          <div className="social-links">
            <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-white"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;