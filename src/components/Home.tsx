import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CurrentProjectService } from '../services/CurrentProjectService';

const Home: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const currentProject = CurrentProjectService.getCurrentProject();

  return (
    <div className="home-container">
      <h1>Witaj w ManagMe!</h1>
      {isAuthenticated ? (
        <>
          <p>Witaj, {user?.login}!</p>
          {currentProject ? (
            <div className="project-info">
              <h2>Aktualny Projekt:</h2>
              <p><strong>ID:</strong> {currentProject.id}</p>
              <p><strong>Nazwa:</strong> {currentProject.name}</p>
              <p><strong>Opis:</strong> {currentProject.description}</p>
              <div className="links">
                <Link to="/projects">Zobacz Projekty</Link>
                <Link to="/add-project">Dodaj Nowy Projekt</Link>
                <Link to="/stories">Zobacz Historyjki</Link>
                <Link to="/add-story">Dodaj Nową Historyjkę</Link>
                <button className="logout-button" onClick={logout}>Wyloguj się</button>
              </div>
            </div>
          ) : (
            <div className="links">
              <Link to="/projects">Zobacz Projekty</Link>
              <Link to="/add-project">Dodaj Nowy Projekt</Link>
              <button className="logout-button" onClick={logout}>Wyloguj się</button>
            </div>
          )}
        </>
      ) : (
        <div className="links">
          <Link to="/login">Logowanie</Link>
          <Link to="/register">Rejestracja</Link>
        </div>
      )}
    </div>
  );
};

export default Home;
