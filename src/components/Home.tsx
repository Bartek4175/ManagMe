import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Witaj w ManagMe!</h1>
            <p><Link to="/projects">Zobacz Projekty</Link></p>
            <p><Link to="/add-project">Dodaj Nowy Projekt</Link></p>
        </div>
    );
};

export default Home;
