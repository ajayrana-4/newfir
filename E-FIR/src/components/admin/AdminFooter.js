import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white py-3 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="small mb-0">
              &copy; {currentYear} E-FIR - Police Administration Portal
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="small mb-0">
              For authorized police personnel only
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AdminFooter;