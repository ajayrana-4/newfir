import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FIREnquiryPage = ({ user, logout }) => {
  const navigate = useNavigate();
  const [firNumber, setFirNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [firData, setFirData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!firNumber.trim()) {
      setError('Please enter a valid FIR number');
      return;
    }
    
    setLoading(true);
    setError('');
    setFirData(null);
    
    try {
      console.log('Searching for FIR:', firNumber);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/firs/search/${firNumber.trim()}`, 
        {
          headers: user?.token ? { 
            'Authorization': `Bearer ${user.token}`
          } : {}
        }
      );
      
      console.log('FIR search response:', response.data);
      
      if (response.data) {
        setFirData(response.data);
        toast.success('FIR details retrieved successfully');
      } else {
        setError('No FIR found with the provided number.');
      }
    } catch (error) {
      console.error('Error searching for FIR:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Unable to retrieve FIR details. Please try again later.';
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'under investigation':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      case 'rejected':
        return 'danger';
      case 'filed':
        return 'info';
      default:
        return 'primary';
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'under investigation':
        return 'fas fa-search';
      case 'resolved':
        return 'fas fa-check-circle';
      case 'closed':
        return 'fas fa-lock';
      case 'rejected':
        return 'fas fa-times-circle';
      case 'filed':
        return 'fas fa-file-alt';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} logout={logout} />
      <Container className="flex-grow-1 py-4">
        <h2 className="mb-4">FIR Status Enquiry</h2>
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">Check FIR Status</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSearch}>
              <Row className="align-items-end">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Enter FIR Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g. FIR001"
                      value={firNumber}
                      onChange={(e) => setFirNumber(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search me-2"></i>
                          Search FIR
                        </>
                      )}
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
            
            {error && (
              <Alert variant="danger" className="mt-4">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
              </Alert>
            )}
          </Card.Body>
        </Card>
        
        {firData && (
          <Card className="shadow-sm border-0 overflow-hidden">
            <div className="bg-primary text-white py-4 px-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">FIR #{firData.firNumber}</h4>
                  <p className="mb-0 text-white-50">
                    <i className="far fa-calendar-alt me-2"></i>
                    Filed on {new Date(firData.createdAt).toLocaleDateString(undefined, { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-white rounded-circle d-flex align-items-center justify-content-center mb-2 mx-auto" style={{width: '60px', height: '60px'}}>
                    <i className={`${getStatusIcon(firData.status)} fa-2x text-${getStatusBadge(firData.status)}`}></i>
                  </div>
                  <Badge 
                    bg={getStatusBadge(firData.status)} 
                    className="px-3 py-2 fs-6"
                    style={{minWidth: '120px'}}
                  >
                    {firData.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Card.Body className="p-4">
              {/* Check and display the description */}
              {firData.description && (
                <Card className="mb-4 shadow-sm border-0">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">
                      <i className="fas fa-clipboard-text me-2 text-primary"></i>
                      Complaint Description
                    </h5>
                  </Card.Header>
                  <Card.Body className="bg-white">
                    <div className="p-3 rounded" style={{backgroundColor: '#f8f9fa'}}>
                      <p className="mb-0 lead">{firData.description}</p>
                    </div>
                  </Card.Body>
                </Card>
              )}
              
              <Row className="g-4">
                <Col md={6}>
                  <Card className="h-100 bg-light border-0">
                    <Card.Body>
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                        Incident Location
                      </h5>
                      <p className="mb-0 fs-5">{firData.incidentLocation}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="h-100 bg-light border-0">
                    <Card.Body>
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="fas fa-calendar-day me-2 text-primary"></i>
                        Incident Date
                      </h5>
                      <p className="mb-0 fs-5">{new Date(firData.incidentDate).toLocaleDateString(undefined, { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="fas fa-exclamation-triangle me-2 text-primary"></i>
                        Incident Type
                      </h5>
                      <div className="d-flex align-items-center">
                        <div className="px-3 py-2 bg-primary text-white rounded">
                          <i className={getIncidentTypeIcon(firData.incidentType)}></i>
                        </div>
                        <p className="mb-0 ms-3 fs-5">{firData.incidentType}</p>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                
                {firData.accusedName && firData.accusedName !== 'Unknown' && (
                  <Col md={6}>
                    <Card className="bg-light border-0">
                      <Card.Body>
                        <h5 className="border-bottom pb-2 mb-3">
                          <i className="fas fa-user-alt me-2 text-primary"></i>
                          Accused Name
                        </h5>
                        <p className="mb-0 fs-5">{firData.accusedName}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
                
                <Col md={12}>
                  <Card className="bg-light border-0">
                    <Card.Body>
                      <h5 className="border-bottom pb-2 mb-3">
                        <i className="fas fa-clipboard-list me-2 text-primary"></i>
                        Status Timeline
                      </h5>
                      <div className="position-relative">
                        <div className="position-absolute" style={{left: '9px', top: '0', bottom: '0', width: '2px', backgroundColor: '#dee2e6'}}></div>
                        
                        <div className="d-flex mb-3">
                          <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '20px', height: '20px', zIndex: 1}}>
                          </div>
                          <div className="ms-3">
                            <div className="fw-bold">Filed</div>
                            <div className="text-muted small">{new Date(firData.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        {firData.status.toLowerCase() !== 'filed' && (
                          <div className="d-flex">
                            <div className={`bg-${getStatusBadge(firData.status)} rounded-circle d-flex align-items-center justify-content-center`} style={{width: '20px', height: '20px', zIndex: 1}}>
                            </div>
                            <div className="ms-3">
                              <div className="fw-bold">{firData.status}</div>
                              <div className="text-muted small">
                                {firData.statusUpdateDate 
                                  ? new Date(firData.statusUpdateDate).toLocaleDateString() 
                                  : 'Date not available'}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                <Button variant="outline-secondary" onClick={() => setFirData(null)}>
                  <i className="fas fa-search me-2"></i>
                  New Search
                </Button>
                <Button variant="primary" onClick={() => window.print()}>
                  <i className="fas fa-print me-2"></i>
                  Print Details
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>
      <Footer />
    </div>
  );
};

// Helper function to get icon for incident type
const getIncidentTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'theft':
      return 'fas fa-mask';
    case 'robbery':
      return 'fas fa-hand-holding-usd';
    case 'assault':
      return 'fas fa-fist-raised';
    case 'burglary':
      return 'fas fa-home';
    case 'fraud':
      return 'fas fa-file-signature';
    case 'vandalism':
      return 'fas fa-hammer';
    default:
      return 'fas fa-exclamation-circle';
  }
};

export default FIREnquiryPage;