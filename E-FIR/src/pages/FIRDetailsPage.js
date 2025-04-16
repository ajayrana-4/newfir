import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Row, Col, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FIRDetailsPage = ({ user, logout }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fir, setFir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFIRDetails = async () => {
      try {
        if (!user || !user.token) {
          setError('Authentication error. Please log in again.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/firs/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFir(response.data);
      } catch (error) {
        console.error('Error loading FIR details:', error);
        setError('An error occurred while loading FIR details');
      } finally {
        setLoading(false);
      }
    };

    fetchFIRDetails();
  }, [id, user]);

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
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
        <Header user={user} logout={logout} />
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

  if (error || !fir) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header user={user} logout={logout} />
        <Container className="flex-grow-1 py-4">
          <Alert variant="danger">{error || 'FIR not found'}</Alert>
          <Button as={Link} to="/my-firs" variant="primary">
            Back to My FIRs
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} logout={logout} />
      <Container className="flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>FIR Details</h2>
          <Badge bg={getStatusBadgeColor(fir.status)} className="px-3 py-2 fs-6">
            {fir.status}
          </Badge>
        </div>

        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">FIR #{fir.firNumber}</h5>
          </Card.Header>
          <Card.Body>
            <Row className="mb-4">
              <Col md={6}>
                <h6 className="text-muted">Complainant Information</h6>
                <p className="mb-1"><strong>Name:</strong> {fir.complainantName}</p>
                <p className="mb-1"><strong>Contact:</strong> {fir.complainantPhone}</p>
                <p><strong>Email:</strong> {fir.complainantEmail}</p>
              </Col>
              <Col md={6}>
                <h6 className="text-muted">Filing Information</h6>
                <p className="mb-1"><strong>Filed On:</strong> {new Date(fir.createdAt).toLocaleDateString()}</p>
                <p><strong>Current Status:</strong> {fir.status}</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <h6 className="text-muted">Incident Details</h6>
                <p className="mb-1"><strong>Type:</strong> {fir.incidentType}</p>
                <p className="mb-1"><strong>Date:</strong> {new Date(fir.incidentDate).toLocaleDateString()}</p>
                <p className="mb-1"><strong>Location:</strong> {fir.incidentLocation}</p>
                <p><strong>Accused:</strong> {fir.accusedName || 'Not specified'}</p>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <h6 className="text-muted">Description</h6>
                <p className="bg-light p-3 rounded">{fir.description}</p>
              </Col>
            </Row>

            {fir.updates && fir.updates.length > 0 && (
              <Row>
                <Col md={12}>
                  <h6 className="text-muted">Status Updates</h6>
                  <div className="border rounded">
                    {fir.updates.map((update, index) => (
                      <div key={index} className={`p-3 ${index < fir.updates.length - 1 ? 'border-bottom' : ''}`}>
                        <div className="d-flex justify-content-between">
                          <strong>{update.status}</strong>
                          <small>{new Date(update.date).toLocaleDateString()}</small>
                        </div>
                        <p className="mb-0 mt-1">{update.comment}</p>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            )}
          </Card.Body>
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between">
              <Button variant="outline-secondary" onClick={() => navigate('/my-firs')}>
                Back to My FIRs
              </Button>
              <Button variant="primary" onClick={() => window.print()}>
                Print FIR
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default FIRDetailsPage;