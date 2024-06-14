import React, { createContext, useState, ReactNode } from 'react';
import { CurrentProjectService } from '../services/CurrentProjectService';
//import { getIdByLogin } from '../api/userApi';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string, login: string, firstName: string, lastName: string, role: string } | null;
  login: (token: string, refreshToken: string, user: { id: string, login: string, firstName: string, lastName: string, role: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: string, login: string, firstName: string, lastName: string, role: string } | null>(() => {
    const id = localStorage.getItem('id');
    const login = localStorage.getItem('login');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const role = localStorage.getItem('role');
    return id && login && firstName && lastName && role ? { id, login, firstName, lastName, role } : null;
  });


  const login = (token: string, refreshToken: string, user: { id: string, login: string, firstName: string, lastName: string, role: string }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    //const dId = getIdByLogin(user.login);
    //getIdByLogin(user.login)
    //console.log(user)
    localStorage.setItem('id', user.id);
    localStorage.setItem('login', user.login);
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('lastName', user.lastName);
    localStorage.setItem('role', user.role);
    setIsAuthenticated(true);
    setUser(user);
    //console.log(user)
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('id');
    localStorage.removeItem('login');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    CurrentProjectService.clearCurrentProject();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
