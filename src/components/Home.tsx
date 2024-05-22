import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CurrentProjectService } from '../services/CurrentProjectService';
import { Button, Card } from 'react-bootstrap';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const currentProject = CurrentProjectService.getCurrentProject();

  return (
    <div className="home-container">
      <h1>Witaj w ManagMe!</h1>
      {isAuthenticated ? (
        <>
          <p>Witaj, {user?.login}!</p>
          {currentProject ? (
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Aktualny Projekt:</Card.Title>
                <Card.Text><strong>ID:</strong> {currentProject.id}</Card.Text>
                <Card.Text><strong>Nazwa:</strong> {currentProject.name}</Card.Text>
                <Card.Text><strong>Opis:</strong> {currentProject.description}</Card.Text>
                <Link to="/projects">
                  <Button variant="primary" className="me-2">Zobacz Projekty</Button>
                </Link>
                <Link to="/add-project">
                  <Button variant="secondary" className="me-2">Dodaj Nowy Projekt</Button>
                </Link>
                <Link to="/stories">
                  <Button variant="info" className="me-2">Zobacz Historyjki</Button>
                </Link>
                <Link to="/add-story">
                  <Button variant="warning" className="me-2">Dodaj Nową Historyjkę</Button>
                </Link>
              </Card.Body>
            </Card>
          ) : (
            <div className="links">
              <Link to="/projects">
                <Button variant="primary" className="me-2">Zobacz Projekty</Button>
              </Link>
              <Link to="/add-project">
                <Button variant="secondary" className="me-2">Dodaj Nowy Projekt</Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="links">
          <Link to="/login">
            <Button variant="primary" className="me-2">Logowanie</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" className="me-2">Rejestracja</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
