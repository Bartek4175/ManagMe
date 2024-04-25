import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryForm from './components/StoryForm';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<ProjectList />} />
                <Route path="/add-project" element={<ProjectForm />} />
                <Route path="/edit-project/:id" element={<ProjectForm />} />
                <Route path="/stories" element={<StoryList />} />
                <Route path="/add-story" element={<StoryForm />} />
                <Route path="/edit-story/:id" element={<StoryForm />} />
            </Routes>
        </Router>
    );
};

export default App;
