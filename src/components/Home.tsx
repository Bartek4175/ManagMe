import React from 'react';
import { Link } from 'react-router-dom';
import { CurrentProjectService } from '../services/CurrentProjectService';

const Home: React.FC = () => {
    const currentProject = CurrentProjectService.getCurrentProject();

    return (
        <div className="home-container">
            <h1>Witaj w ManagMe!</h1>
            {currentProject && (
                <div className="project-info">
                    <h2>Aktualny Projekt:</h2>
                    <p><strong>ID:</strong> {currentProject.id}</p>
                    <p><strong>Nazwa:</strong> {currentProject.name}</p>
                    <p><strong>Opis:</strong> {currentProject.description}</p>
                </div>
            )}
            <div className="links">
                <Link to="/projects">Zobacz Projekty</Link>
                <Link to="/add-project">Dodaj Nowy Projekt</Link>
                <Link to="/stories">Zobacz Historyjki</Link>
                <Link to="/add-story">Dodaj Nową Historyjkę</Link>
            </div>
        </div>
    );
};

export default Home;
