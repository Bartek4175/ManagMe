import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ login, password, firstName, lastName, role })
      });

      if (!response.ok) {
        throw new Error('Rejestracja nie powiodła się');
      }

      navigate('/login');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Rejestracja</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={login}
        onChange={e => setLogin(e.target.value)}
        placeholder="Login"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Hasło"
        required
      />
      <input
        type="text"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="Imię"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Nazwisko"
        required
      />
      <select value={role} onChange={e => setRole(e.target.value as 'admin' | 'devops' | 'developer')}>
        <option value="developer">Developer</option>
        <option value="devops">DevOps</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">Zarejestruj się</button>
    </form>
  );
};

export default RegisterForm;
