import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="py-2">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/assets/images/police-badge.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="eFIR Logo"
          />
          eFIR Platform
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to="/register-fir">Register FIR</Nav.Link>
                <Nav.Link as={Link} to="/my-firs">My FIRs</Nav.Link>
                <Nav.Link as={Link} to="/fir-enquiry">Check Status</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/enquiry">General Enquiry</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={`Welcome, ${user.name}`} id="basic-nav-dropdown" align="end">
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex">
                <Button as={Link} to="/login" variant="outline-light" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="light">Register</Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;