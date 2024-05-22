import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './components/Home';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryForm from './components/StoryForm';
import TaskForm from './components/TaskForm';
import TaskDetails from './components/TaskDetails';
import KanbanBoard from './components/KanbanBoard';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrentProjectService } from './services/CurrentProjectService';
import CustomNavbar from './components/CustomNavbar';
import { Container } from 'react-bootstrap';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return children;
};

const ProjectProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const currentProject = CurrentProjectService.getCurrentProject();
  if (!currentProject) {
    return <Navigate to="/projects" />;
  }
  return children;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    document.body.classList.toggle('dark-mode', savedMode);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  return (
    <AuthProvider>
      <Router>
        <CustomNavbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectList /></ProtectedRoute>} />
            <Route path="/add-project" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/edit-project/:id" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
            <Route path="/stories" element={<ProtectedRoute><ProjectProtectedRoute><StoryList /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/add-story" element={<ProtectedRoute><ProjectProtectedRoute><StoryForm /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/edit-story/:id" element={<ProtectedRoute><ProjectProtectedRoute><StoryForm /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/tasks/:storyId" element={<ProtectedRoute><ProjectProtectedRoute><KanbanBoard /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/add-task/:storyId" element={<ProtectedRoute><ProjectProtectedRoute><TaskForm /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/edit-task/:storyId/:taskId" element={<ProtectedRoute><ProjectProtectedRoute><TaskForm /></ProjectProtectedRoute></ProtectedRoute>} />
            <Route path="/task/:id" element={<ProtectedRoute><ProjectProtectedRoute><TaskDetails /></ProjectProtectedRoute></ProtectedRoute>} />
          </Routes>
        </Container>
      </Router>
    </AuthProvider>
  );
};

export default App;
