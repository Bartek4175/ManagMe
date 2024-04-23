import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/add-project" element={<ProjectForm />} />
                <Route path="/edit-project/:id" element={<ProjectForm />} />
            </Routes>
        </Router>
    );
};

export default App;
