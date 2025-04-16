import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhar: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Check if admin is already logged in
  useEffect(() => {
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        aadhar: formData.aadhar,
        password: formData.password
      });
      
      setSuccess('Registration successful! You can now login.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        aadhar: '',
        password: '',
        confirmPassword: '',
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header isAdmin={true} />
      <Container className="flex-grow-1 py-4">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Register as Police Admin</h4>
              </Card.Header>
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Aadhar Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="aadhar"
                          value={formData.aadhar}
                          onChange={handleChange}
                          placeholder="Enter your Aadhar number"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Enter your password"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-grid mt-3">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Register as Police Admin'}
                    </Button>
                  </div>
                </Form>
                
                <div className="mt-3 text-center">
                  <p>Already have an account? <Link to="/admin/login">Login as Police Admin</Link></p>
                  <p>Not a police admin? <Link to="/">Go to Homepage</Link></p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminRegisterPage;