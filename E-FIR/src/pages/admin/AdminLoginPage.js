import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/admin/login`, formData);
      
      // Store admin user in localStorage
      localStorage.setItem('adminUser', JSON.stringify(response.data));
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header isAdmin={true} />
      <Container className="flex-grow-1 py-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Police Admin Login</h4>
              </Card.Header>
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
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
                  
                  <Form.Group className="mb-4">
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
                  
                  <div className="d-grid">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Logging In...' : 'Login as Police Admin'}
                    </Button>
                  </div>
                </Form>
                
                <div className="mt-3 text-center">
                  <p>Not a police admin? <Link to="/">Go to Homepage</Link></p>
                  <p>Don't have an account? <Link to="/admin/register">Register as Police Admin</Link></p>
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

export default AdminLoginPage;