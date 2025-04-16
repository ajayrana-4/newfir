import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const ProfilePage = ({ user, logout, updateUser }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });

  // Update form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      console.log('Profile loaded user data:', user);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || formData.name.trim() === '') {
      toast.error('Name cannot be empty');
      return;
    }
    
    // Important: Only update fields that were modified, preserve other fields
    const updatedUserData = {};
    
    // Only include fields that have changed
    if (formData.name.trim() !== user.name) {
      updatedUserData.name = formData.name.trim();
    }
    
    if (formData.phone.trim() !== user.phone) {
      updatedUserData.phone = formData.phone.trim();
    }
    
    // Call the updateUser function from props if there are changes
    if (Object.keys(updatedUserData).length > 0) {
      updateUser(updatedUserData);
      toast.success('Profile updated successfully');
    } else {
      toast.info('No changes were made');
    }
    
    // Exit edit mode
    setIsEditing(false);
  };

  // If no user data is available, show a message
  if (!user) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header user={user} logout={logout} />
        <Container className="flex-grow-1 py-4 text-center">
          <h2>User Profile</h2>
          <p>Please log in to view your profile</p>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} logout={logout} />
      <Container className="flex-grow-1 py-4">
        <h2 className="mb-4">User Profile</h2>
        
        <Row>
          <Col md={8} className="mx-auto">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Personal Information</h5>
              </Card.Header>
              <Card.Body>
                {isEditing ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Form.Control
                        type="email"
                        value={formData.email}
                        disabled
                      />
                      <Form.Text className="text-muted">
                        Email address cannot be changed
                      </Form.Text>
                    </Form.Group>
                    
                    <Form.Group className="mb-4">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="secondary" 
                        className="me-2"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data to current user data
                          setFormData({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button variant="primary" type="submit">
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                ) : (
                  <>
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Full Name:</Col>
                      <Col md={9}>{user.name || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Email Address:</Col>
                      <Col md={9}>{user.email}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Phone Number:</Col>
                      <Col md={9}>{user.phone || 'Not provided'}</Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={3} className="fw-bold">Account Type:</Col>
                      <Col md={9}>{user.role === 'citizen' ? 'Citizen' : user.role || 'Citizen'}</Col>
                    </Row>
                    
                    <div className="d-flex justify-content-end">
                      <Button 
                        variant="primary" 
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm mt-4">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">Account Settings</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid">
                  <Button 
                    variant="danger" 
                    onClick={logout}
                  >
                    Log Out
                  </Button>
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

export default ProfilePage;