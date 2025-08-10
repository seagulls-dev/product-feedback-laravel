import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Verify token is still valid
        authAPI.me().then(response => {
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        }).catch(() => {
          // Token is invalid, clear storage
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setUser(null);
        });
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<void> => {
    try {
      const response = await authAPI.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      setUser(response.user);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
