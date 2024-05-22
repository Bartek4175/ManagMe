import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">ManagMe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
            <Nav.Link as={Link} to="/add-project">Add Project</Nav.Link>
            <Nav.Link as={Link} to="/stories">Stories</Nav.Link>
            <Nav.Link as={Link} to="/add-story">Add Story</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label="Dark Mode"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="me-3"
            />
            {isAuthenticated && (
              <>
                <span className="me-2">Signed in as: {user?.login}</span>
                <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
