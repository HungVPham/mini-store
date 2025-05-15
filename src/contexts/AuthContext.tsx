import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface AuthData {
  access_token: string;
  refresh_token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthData | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      try {
        const authData = JSON.parse(savedAuth);
        setUser(authData);
        setIsAuthenticated(true);
        queryClient.setQueryData(['auth'], authData);
      } catch (error) {
        console.error('Failed to parse saved auth data:', error);
        localStorage.removeItem('auth');
      }
    }
  }, [queryClient]);

  const login = (data: AuthData) => {
    localStorage.setItem('auth', JSON.stringify(data));
    setUser(data);
    setIsAuthenticated(true);
    queryClient.setQueryData(['auth'], data);
    navigate('/products');
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
    setIsAuthenticated(false);
    queryClient.setQueryData(['auth'], null);
    navigate('/login');
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

