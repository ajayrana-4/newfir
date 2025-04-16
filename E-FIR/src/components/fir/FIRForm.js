import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const FIRForm = ({ user }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    complainantName: user?.name || '',
    complainantPhone: user?.phone || '',
    complainantAddress: '',
    accusedName: '',
    incidentDate: '',
    incidentLocation: '',
    incidentType: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const { complainantName, complainantPhone, complainantAddress, incidentDate, incidentLocation, incidentType, description } = formData;

    if (!complainantName.trim()) newErrors.complainantName = 'Name is required';
    if (!complainantPhone.trim()) newErrors.complainantPhone = 'Phone number is required';
    if (!complainantAddress.trim()) newErrors.complainantAddress = 'Address is required';
    if (!incidentDate) newErrors.incidentDate = 'Incident date is required';
    if (!incidentLocation.trim()) newErrors.incidentLocation = 'Incident location is required';
    if (!incidentType) newErrors.incidentType = 'Please select incident type';
    if (!description || description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!user || !user.token) {
      toast.error('Authentication required. Please log in.');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    setFormError('');
    
    try {
      const firData = {
        firNumber: `FIR${Date.now().toString().slice(-8)}`, // Generate unique FIR number
        ...formData
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/firs`, 
        firData, 
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      toast.success('FIR submitted successfully!');
      navigate('/my-firs');
    } catch (error) {
      console.error('Error submitting FIR:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit FIR. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Register New FIR</h5>
      </Card.Header>
      <Card.Body>
        {formError && <Alert variant="danger">{formError}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Complainant Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="complainantName"
                  value={formData.complainantName}
                  onChange={handleChange}
                  isInvalid={!!errors.complainantName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.complainantName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Complainant Phone *</Form.Label>
                <Form.Control
                  type="text"
                  name="complainantPhone"
                  value={formData.complainantPhone}
                  onChange={handleChange}
                  isInvalid={!!errors.complainantPhone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.complainantPhone}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Complainant Address *</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="complainantAddress"
                  value={formData.complainantAddress}
                  onChange={handleChange}
                  isInvalid={!!errors.complainantAddress}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.complainantAddress}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Accused Name (if known)</Form.Label>
                <Form.Control
                  type="text"
                  name="accusedName"
                  value={formData.accusedName}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incident Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  isInvalid={!!errors.incidentDate}
                  max={new Date().toISOString().split('T')[0]}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.incidentDate}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incident Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  isInvalid={!!errors.incidentLocation}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.incidentLocation}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Incident Type *</Form.Label>
                <Form.Select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  isInvalid={!!errors.incidentType}
                >
                  <option value="">Select Incident Type</option>
                  <option value="Theft">Theft</option>
                  <option value="Robbery">Robbery</option>
                  <option value="Assault">Assault</option>
                  <option value="Burglary">Burglary</option>
                  <option value="Fraud">Fraud</option>
                  <option value="Vandalism">Vandalism</option>
                  <option value="Other">Other</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.incidentType}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Incident Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              isInvalid={!!errors.description}
              placeholder="Please provide detailed description of the incident..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-between mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit FIR'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FIRForm;