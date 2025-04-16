import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage = ({ user, logout }) => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to the about section
    if (location.search.includes('scrollTo=about')) {
      setTimeout(() => {
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location]);

  // If user is logged in, show a dashboard-style home page
  if (user) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Header user={user} logout={logout} />
        
        {/* User Welcome Section */}
        <section className="bg-primary text-white py-5">
          <Container>
            <Row className="align-items-center">
              <Col lg={8} className="mx-auto text-center">
                <h1 className="display-4 fw-bold mb-3">
                  Welcome, {user.name}
                </h1>
                <p className="lead mb-4">
                  Access all FIR services from your dashboard. What would you like to do today?
                </p>
              </Col>
            </Row>
          </Container>
        </section>
        
        {/* FIR Services Section */}
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-4">FIR Services</h2>
            <Row className="justify-content-center">
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center shadow-sm">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-file-alt text-primary fa-3x"></i>
                    </div>
                    <h5>Register New FIR</h5>
                    <p className="text-muted">File a complaint by registering a new FIR.</p>
                    <Button as={Link} to="/register-fir" variant="primary">Register FIR</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center shadow-sm">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-search text-primary fa-3x"></i>
                    </div>
                    <h5>Check FIR Status</h5>
                    <p className="text-muted">Check the status of any filed FIR.</p>
                    <Button as={Link} to="/fir-enquiry" variant="primary">Check Status</Button>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="mb-3">
                <Card className="h-100 text-center shadow-sm">
                  <Card.Body>
                    <div className="mb-3">
                      <i className="fas fa-list text-primary fa-3x"></i>
                    </div>
                    <h5>View Your FIRs</h5>
                    <p className="text-muted">Access all FIRs you have registered.</p>
                    <Button as={Link} to="/my-firs" variant="primary">My FIRs</Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
        
        {/* About Section - Added to the logged-in view */}
        <section id="about-section" className="py-5 bg-light">
          <Container>
            <h2 className="text-center mb-4">About eFIR</h2>
            <Row className="justify-content-center">
              <Col md={10} lg={8}>
                <p className="text-center">
                  eFIR is an advanced FIR Management Platform designed to streamline the process of filing 
                  and tracking First Information Reports. Our system connects citizens directly with law 
                  enforcement agencies, enabling faster response times and more efficient case management.
                </p>
                <p className="text-center">
                  With eFIR, citizens can file complaints online without visiting a police station, 
                  track the status of their complaints in real-time, and receive timely updates on the investigation.
                </p>
                <p className="text-center">
                  For law enforcement, eFIR provides a centralized database of all complaints, 
                  efficient case management tools, and analytics to help identify trends and allocate resources effectively.
                </p>
              </Col>
            </Row>
          </Container>
        </section>
        
        <Footer />
      </div>
    );
  }

  // Non-logged in view (original home page)
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header user={user} logout={logout} />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-3">
                Advanced FIR Management Platform
              </h1>
              <p className="lead mb-4">
                File and track your FIRs online. Our platform streamlines the entire process, 
                making it easier for citizens to report incidents and for police to manage cases.
              </p>
              <div className="d-flex gap-3">
                <Button as={Link} to="/register" variant="light" size="lg">
                  Register Now
                </Button>
                <Button as={Link} to="/login" variant="outline-light" size="lg">
                  Login
                </Button>
              </div>
            </Col>
            <Col lg={6} className="text-end">
              <img 
                src="/assets/images/herophoto.jpg" 
                alt="eFIR Platform" 
                className="img-fluid rounded shadow"
                style={{ maxWidth: '75%', width: '500px', opacity: 0.75 }}
              />
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* About Section */}
      <section id="about-section" className="py-5">
        <Container>
          <h2 className="text-center mb-4">About eFIR</h2>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <p className="text-center">
                E-FIR is an advanced FIR Management Platform designed to streamline the process of filing 
                and tracking First Information Reports. Our system connects citizens directly with law 
                enforcement agencies, enabling faster response times and more efficient case management.
              </p>
              <p className="text-center">
                With E-FIR, citizens can file complaints online without visiting a police station, 
                track the status of their complaints in real-time, and receive timely updates on the investigation.
              </p>
              <p className="text-center">
                For law enforcement, E-FIR provides a centralized database of all complaints, 
                efficient case management tools, and analytics to help identify trends and allocate resources effectively.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Key Features</h2>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm text-center p-3">
                <div className="mb-3">
                  <i className="fas fa-file-alt text-primary fa-3x"></i>
                </div>
                <Card.Body>
                  <h5>Online FIR Filing</h5>
                  <p className="text-muted">
                    File your FIR online from anywhere, anytime without visiting the police station.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm text-center p-3">
                <div className="mb-3">
                  <i className="fas fa-search text-primary fa-3x"></i>
                </div>
                <Card.Body>
                  <h5>Real-time Tracking</h5>
                  <p className="text-muted">
                    Track the status of your filed FIR in real-time with detailed updates.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="h-100 shadow-sm text-center p-3">
                <div className="mb-3">
                  <i className="fas fa-bell text-primary fa-3x"></i>
                </div>
                <Card.Body>
                  <h5>Instant Notifications</h5>
                  <p className="text-muted">
                    Receive instant notifications about any updates to your FIR status.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* How It Works Section */}
      <section className="py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="d-flex flex-column flex-md-row justify-content-between">
                <div className="text-center mb-4 mb-md-0">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <h4 className="mb-0">1</h4>
                  </div>
                  <h5>Register</h5>
                  <p className="text-muted">Create your account</p>
                </div>
                <div className="d-none d-md-block align-self-center">
                  <i className="fas fa-chevron-right text-primary"></i>
                </div>
                <div className="text-center mb-4 mb-md-0">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <h4 className="mb-0">2</h4>
                  </div>
                  <h5>File FIR</h5>
                  <p className="text-muted">Submit incident details</p>
                </div>
                <div className="d-none d-md-block align-self-center">
                  <i className="fas fa-chevron-right text-primary"></i>
                </div>
                <div className="text-center mb-4 mb-md-0">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '60px', height: '60px'}}>
                    <h4 className="mb-0">3</h4>
                  </div>
                  <h5>Track Status</h5>
                  <p className="text-muted">Monitor investigation</p>
                </div>
              </div>
            </Col>
          </Row>
          <div className="text-center mt-5">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Get Started Now
            </Button>
          </div>
        </Container>
      </section>
      
      {/* CTA Section */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="bg-primary text-white shadow text-center p-4">
                <Card.Body>
                  <h3 className="mb-3">Ready to get started?</h3>
                  <p className="lead mb-4">
                    Join thousands of citizens who are using E-FIR platform for faster and more efficient incident reporting.
                  </p>
                  <Button as={Link} to="/register" variant="light" size="lg">
                    Register Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      <Footer />
    </div>
  );
};

export default HomePage;