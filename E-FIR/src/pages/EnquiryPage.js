import React from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const EnquiryPage = ({ user, logout }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} logout={logout} />
      <div className="flex-grow-1">
        <Container className="py-4">
          <h2 className="mb-4">Enquiry Form</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="shadow-sm">
                <Card.Body className="p-4">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Your Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your name" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control type="email" placeholder="Enter your email" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type="tel" placeholder="Enter your phone number" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>FIR Number (if applicable)</Form.Label>
                      <Form.Control type="text" placeholder="Enter FIR number" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Your Enquiry</Form.Label>
                      <Form.Control as="textarea" rows={4} placeholder="Please describe your enquiry in detail..." />
                    </Form.Group>
                    
                    <div className="d-grid">
                      <Button variant="primary" type="submit">
                        Submit Enquiry
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default EnquiryPage;