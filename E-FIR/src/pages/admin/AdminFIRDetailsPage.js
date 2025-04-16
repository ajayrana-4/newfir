import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminFIRDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  
  // State for status update
  const [statusData, setStatusData] = useState({
    status: '',
    comment: ''
  });
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const storedUser = localStorage.getItem('adminUser');
    if (!storedUser) {
      navigate('/admin/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setAdminUser(parsedUser);
    
    // Fetch FIR details
    const fetchFIR = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/firs/${id}`, {
          headers: { 
            Authorization: `Bearer ${parsedUser.token}` 
          }
        });
        
        setFir(response.data);
        // Initialize status form with current status
        setStatusData({
          status: response.data.status,
          comment: ''
        });
      } catch (error) {
        console.error('Error fetching FIR:', error);
        setError('Failed to load FIR details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFIR();
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    // Navigate to home page instead of login page
    navigate('/');
  };

  const handleChange = (e) => {
    setStatusData({
      ...statusData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    
    setUpdating(true);
    setUpdateSuccess('');
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/firs/${id}/status`,
        statusData,
        {
          headers: { 
            Authorization: `Bearer ${adminUser.token}` 
          }
        }
      );
      
      // Update local FIR data
      setFir(response.data.fir);
      
      // Reset comment field
      setStatusData({
        status: response.data.fir.status,
        comment: ''
      });
      
      setUpdateSuccess('FIR status updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating FIR status:', error);
      setError('Failed to update FIR status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  // Function to get status badge color
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'filed':
        return 'info';
      case 'under investigation':
        return 'warning';
      case 'resolved':
        return 'success';
      case 'closed':
        return 'secondary';
      case 'rejected':
        return 'danger';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header user={adminUser?.user} logout={handleLogout} isAdmin={true} />
        <Container className="flex-grow-1 py-4 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading FIR details...</p>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={adminUser?.user} logout={handleLogout} isAdmin={true} />
      <Container className="flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>FIR Details</h2>
          <Badge bg={getStatusBadge(fir.status)} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
            {fir.status}
          </Badge>
        </div>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {updateSuccess && <Alert variant="success">{updateSuccess}</Alert>}
        
        <Row className="mb-4">
          <Col md={8}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">FIR #{fir.firNumber}</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6 className="text-muted">Complainant Information</h6>
                    <p><strong>Name:</strong> {fir.complainantName}</p>
                    <p><strong>Phone:</strong> {fir.complainantPhone}</p>
                  </Col>
                  <Col md={6}>
                    <h6 className="text-muted">Incident Details</h6>
                    <p><strong>Type:</strong> {fir.incidentType}</p>
                    <p><strong>Date:</strong> {new Date(fir.incidentDate).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {fir.incidentLocation}</p>
                  </Col>
                </Row>
                
                <h6 className="text-muted mb-2">Description</h6>
                <div className="p-3 bg-light rounded mb-4">
                  <p className="mb-0">{fir.description}</p>
                </div>
                
                <h6 className="text-muted mb-2">Status History</h6>
                <div className="p-3 bg-light rounded">
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg="info" className="me-2">Filed</Badge>
                    <span>{new Date(fir.createdAt).toLocaleString()}</span>
                  </div>
                  
                  {fir.statusUpdates && fir.statusUpdates.map((update, index) => (
                    <div key={index} className="d-flex flex-column mb-2 border-top pt-2">
                      <div className="d-flex align-items-center">
                        <Badge bg={getStatusBadge(update.status)} className="me-2">{update.status}</Badge>
                        <span>{new Date(update.date).toLocaleString()}</span>
                      </div>
                      {update.comment && (
                        <p className="mb-0 mt-1 ms-4"><small>{update.comment}</small></p>
                      )}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="shadow-sm mb-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Update Status</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdateStatus}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select 
                      name="status" 
                      value={statusData.status} 
                      onChange={handleChange}
                      required
                    >
                      <option value="Filed">Filed</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                      <option value="Rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Comment (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="comment"
                      value={statusData.comment}
                      onChange={handleChange}
                      placeholder="Add a comment about this status update"
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={updating}
                    >
                      {updating ? 'Updating...' : 'Update Status'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            
            <Button 
              as={Link} 
              to="/admin/dashboard" 
              variant="outline-secondary" 
              className="w-100"
            >
              Back to Dashboard
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminFIRDetailPage;