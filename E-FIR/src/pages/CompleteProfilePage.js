import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const { completeProfile, mongoUser } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    aadhar: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const { phone, aadhar } = formData;
    
    // Validate phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    // Validate Aadhar (12 digits)
    const aadharRegex = /^[0-9]{12}$/;
    if (!aadhar.trim()) {
      newErrors.aadhar = 'Aadhar number is required';
    } else if (!aadharRegex.test(aadhar)) {
      newErrors.aadhar = 'Aadhar number must be 12 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setGeneralError('');
    
    try {
      // Submit the profile data using the Auth context
      await completeProfile(formData.phone, formData.aadhar);
      
      toast.success('Profile completed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error completing profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to complete profile. Please try again.';
      setGeneralError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Container className="flex-grow-1 py-4">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">Complete Your Profile</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  {mongoUser?.photoUrl ? (
                    <img
                      src={mongoUser.photoUrl}
                      alt="Profile"
                      width="80"
                      height="80"
                      className="rounded-circle mb-3"
                    />
                  ) : (
                    <img
                      src="/assets/images/profile-icon.png" 
                      alt="Complete Profile"
                      width="80"
                      className="mb-3"
                    />
                  )}
                  <h5>Welcome, {mongoUser?.name || 'User'}!</h5>
                  <p className="text-muted">
                    Please provide your phone number and Aadhar details to complete your profile.
                  </p>
                </div>
                
                {generalError && <Alert variant="danger">{generalError}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit phone number"
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Aadhar Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="aadhar"
                      value={formData.aadhar}
                      onChange={handleChange}
                      placeholder="Enter your 12-digit Aadhar number"
                      isInvalid={!!errors.aadhar}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aadhar}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Your Aadhar number is required for verification purposes.
                    </Form.Text>
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isLoading}
                      className="py-2"
                    >
                      {isLoading ? 'Submitting...' : 'Complete Profile'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default CompleteProfilePage;