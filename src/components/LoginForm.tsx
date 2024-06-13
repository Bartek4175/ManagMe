import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from './GoogleLoginButton';

const LoginForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Password cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password })
      });

      if (!response.ok) {
        throw new Error('Invalid login or password');
      }

      const data = await response.json();
      loginUser(data.token, data.refreshToken, {
        id: data.user.id,
        login: data.user.login,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        role: data.user.role,
      });
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formLogin">
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="text"
            value={login}
            onChange={e => setLogin(e.target.value)}
            placeholder="Login"
            required
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">Login</Button>
      </Form>
      <GoogleLoginButton />
      <p className="mt-3">Nie masz konta? <Link to="/register">Zarejestruj się</Link></p>
    </Container>
  );
};

export default LoginForm;
