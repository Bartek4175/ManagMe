import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { registerUser } from '../api/authApi';

const RegisterForm: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'admin' | 'devops' | 'developer'>('developer');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await registerUser({ login, password, firstName, lastName, role });
      navigate('/login');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2 className="text-center">Rejestracja</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formLogin">
              <Form.Label>Login</Form.Label>
              <Form.Control
                type="text"
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="Wpisz login"
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Hasło</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Wpisz hasło"
                required
              />
            </Form.Group>
            <Form.Group controlId="formFirstName" className="mt-3">
              <Form.Label>Imię</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="Wpisz imię"
                required
              />
            </Form.Group>
            <Form.Group controlId="formLastName" className="mt-3">
              <Form.Label>Nazwisko</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Wpisz nazwisko"
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole" className="mt-3">
              <Form.Label>Rola</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={e => setRole(e.target.value as 'admin' | 'devops' | 'developer')}
              >
                <option value="developer">Developer</option>
                <option value="devops">DevOps</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
