"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jwt from 'jsonwebtoken';

interface AuthContextType {
  id?: string;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [id, setId] = useState<string | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const decodeToken = (token: string): { id: string } | null => {
    try {
      const decoded: any = jwt.decode(token);
      if (decoded && decoded.id) {
        return { id: decoded.id };
      } else {
        console.error('Token does not contain id');
        return null;
      }
    } catch (error) {
      console.error('Token decoding failed:', error);
      return null;
    }
  };

  const login = (token: string) => {
    const decoded = decodeToken(token);
    if (decoded) {
      setId(decoded.id);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setId(undefined);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setId(decoded.id);
        setIsAuthenticated(true);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ id, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
