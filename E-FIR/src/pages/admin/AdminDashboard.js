import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [firs, setFirs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check if admin is logged in
    const storedUser = localStorage.getItem('adminUser');
    if (!storedUser) {
      navigate('/admin/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setAdminUser(parsedUser);
    
    // Fetch FIRs
    const fetchFIRs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/firs`, {
          headers: { 
            Authorization: `Bearer ${parsedUser.token}` 
          }
        });
        
        setFirs(response.data);
      } catch (error) {
        console.error('Error fetching FIRs:', error);
        setError('Failed to load FIRs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFIRs();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    // Navigate to home page instead of login page
    navigate('/');
  };

  // Function to get status badge color
  const getStatusBadge = (status) => {
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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={adminUser?.user} logout={handleLogout} isAdmin={true} />
      <Container className="flex-grow-1 py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Police Admin Dashboard</h2>
        </div>
        
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-primary text-white">
            <h5 className="mb-0">All FIRs</h5>
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading FIRs...</p>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : firs.length === 0 ? (
              <Alert variant="info">No FIRs found in the system.</Alert>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>FIR Number</th>
                    <th>Complainant</th>
                    <th>Incident Type</th>
                    <th>Date Filed</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {firs.map((fir) => (
                    <tr key={fir._id}>
                      <td>{fir.firNumber}</td>
                      <td>{fir.complainantName}</td>
                      <td>{fir.incidentType}</td>
                      <td>{new Date(fir.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={getStatusBadge(fir.status)}>
                          {fir.status}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/admin/fir/${fir._id}`}
                          variant="primary"
                          size="sm"
                        >
                          View & Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </div>
  );
};

export default AdminDashboard;