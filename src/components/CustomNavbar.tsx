import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import { Navbar, Nav, Container, Form, Badge } from 'react-bootstrap';
import { BellFill } from 'react-bootstrap-icons';
import { notificationService } from '../services/NotificationService';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CustomNavbar: React.FC<NavbarProps> = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = notificationService.unreadCount().subscribe(setUnreadCount);
    return () => subscription.unsubscribe();
  }, []);

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  return (
    <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">ManagMe</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Strona główna</Nav.Link>
            <Nav.Link as={Link} to="/projects">Projekty</Nav.Link>
            <Nav.Link as={Link} to="/add-project">Nowy projekt</Nav.Link>
            <Nav.Link as={Link} to="/stories">Stories</Nav.Link>
            <Nav.Link as={Link} to="/add-story">Nowe story</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Form.Check
              type="switch"
              id="dark-mode-switch"
              label="Tryb ciemny"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="me-3"
            />
            {isAuthenticated && (
              <>
                <div className="me-3 position-relative" onClick={handleNotificationsClick} style={{ cursor: 'pointer' }}>
                  <BellFill size={20} />
                  {
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {unreadCount}
                    </Badge>
                  }
                </div>
                <span className="me-2">Zalogowany jako: {user?.login}</span>
                <button className="btn btn-outline-danger" onClick={logout}>Wyloguj się</button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
