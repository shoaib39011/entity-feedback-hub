
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  username: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: 'user' | 'admin') => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: 'user' | 'admin') => {
    // In a real app, this would validate against a backend
    // For demo purposes, we'll simulate a successful login
    const userId = Math.random().toString(36).substring(2, 10);
    setUser({ id: userId, username, role });
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
