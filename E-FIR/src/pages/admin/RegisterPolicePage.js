import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminFooter from '../../components/admin/AdminFooter';

const RegisterPolicePage = ({ adminUser, adminLogout }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadhar: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { name, email, phone, aadhar, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Validate phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Validate Aadhar
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadhar) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!aadharRegex.test(aadhar)) {
      newErrors.aadhar = 'Aadhar number must be 12 digits';
    }
    
    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm the password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Use the validation function
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormError('');

    try {
      // Check admin authentication
      if (!adminUser || !adminUser.token) {
        setFormError('Authentication error. Please log in again.');
        setIsLoading(false);
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/register-police`, 
        {
          name,
          email,
          phone,
          aadhar,
          password,
        },
        {
          headers: { Authorization: `Bearer ${adminUser.token}` }
        }
      );

      // Handle successful registration
      console.log('Police user registration successful:', response.data);
      toast.success('Police officer registered successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminHeader adminUser={adminUser} adminLogout={adminLogout} />
      <Container className="flex-grow-1 py-4">
        <h2 className="mb-4">Register New Police User</h2>
        
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {formError && <Alert variant="danger">{formError}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="phone"
                          value={phone}
                          onChange={handleChange}
                          placeholder="10-digit mobile"
                          isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Aadhar Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="aadhar"
                          value={aadhar}
                          onChange={handleChange}
                          placeholder="12-digit Aadhar"
                          isInvalid={!!errors.aadhar}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.aadhar}
                        </Form.Control.Feedback>
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
                          value={password}
                          onChange={handleChange}
                          placeholder="Create a password"
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={handleChange}
                          placeholder="Confirm your password"
                          isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-between mt-4">
                    <Button 
                      variant="secondary" 
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Registering...' : 'Register Police User'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <AdminFooter />
    </div>
  );
};

export default RegisterPolicePage;