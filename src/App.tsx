import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Home from './pages/Home';
import ProjectForm from './pages/ProjectForm';
import ProjectList from './components/ProjectList';
import StoryList from './components/StoryList';
import StoryForm from './pages/StoryForm';
import TaskForm from './pages/TaskForm';
import TaskDetails from './components/TaskDetails';
import KanbanBoard from './pages/KanbanBoard';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';
import { useAuth } from './contexts/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import { Container } from 'react-bootstrap';
import CustomNavbar from './components/CustomNavbar';
import NotificationList from './pages/NotificationList';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
              <Route path="/stories" element={<ProtectedRoute><StoryList /></ProtectedRoute>} />
              <Route path="/add-story" element={<ProtectedRoute><StoryForm /></ProtectedRoute>} />
              <Route path="/edit-story/:id" element={<ProtectedRoute><StoryForm /></ProtectedRoute>} />
              <Route path="/tasks/:storyId" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
              <Route path="/add-task/:storyId" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
              <Route path="/edit-task/:storyId/:taskId" element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
              <Route path="/task/:id" element={<ProtectedRoute><TaskDetails /></ProtectedRoute>} />
              <Route path="/notifications" element={<NotificationList />} />
            </Routes>
          </Container>
        </Router>
      </AuthProvider>
  );
};

export default App;
