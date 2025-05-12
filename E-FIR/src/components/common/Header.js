import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, logout, isAdmin = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (logout) {
      logout();
      // Always navigate to home page on logout
      navigate('/');
    }
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/assets/images/logo.png"
            width="50"
            height="50"
            className="d-inline-block align-top me-2"
            alt="E-FIR Logo"
          />
          {isAdmin ? 'E-FIR Police Admin' : 'E-FIR'}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            
            {isAdmin ? (
              // Admin Nav Items
              <Nav.Link as={Link} to="/admin/dashboard">Dashboard</Nav.Link>
            ) : (
              // Regular User Nav Items
              user ? (
                <>
                  <Nav.Link as={Link} to="/register-fir">Register FIR</Nav.Link>
                  <Nav.Link as={Link} to="/my-firs">My FIRs</Nav.Link>
                  <Nav.Link as={Link} to="/fir-enquiry">Check Status</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/enquiry">General Enquiry</Nav.Link>
                </>
              )
            )}
          </Nav>
          <Nav>
            {/* Admin link and login/register buttons when no user is logged in */}
            {!user && !isAdmin && (
              <div className="d-flex">
                <Button as={Link} to="/admin/login" variant="outline-light" className="me-2">
                  Admin Portal
                </Button>
                <Button as={Link} to="/login" variant="outline-light" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="light">Register</Button>
              </div>
            )}
            
            {/* User dropdown when user is logged in */}
            {user && (
              <NavDropdown title={`Welcome, ${user.name}`} id="basic-nav-dropdown" align="end">
                {!isAdmin && <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
            
            {/* Show logout button for admin if logged in */}
            {isAdmin && !user && (
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;