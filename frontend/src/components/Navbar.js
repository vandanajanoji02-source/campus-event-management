import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavbarComponent() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="navbar-dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          📅 Campus Events
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/events">
              Events
            </Nav.Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <>
                    <Nav.Link as={Link} to="/admin">
                      Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/admin/create-event">
                      Create Event
                    </Nav.Link>
                  </>
                )}

                {user?.role === 'student' && (
                  <Nav.Link as={Link} to="/my-registrations">
                    My Registrations
                  </Nav.Link>
                )}

                <Nav.Link as={Link} to="/profile">
                  {user?.name}
                </Nav.Link>

                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="ms-2">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
