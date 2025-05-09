
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  company?: string; // Company association for the user
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: 'user' | 'admin', company?: string) => void;
  signup: (username: string, email: string, password: string, company: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: User[]; // Store all users (for demo purposes)
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
  const [users, setUsers] = useState<User[]>([
    // Pre-populated admin users for each company
    { 
      id: 'admin1', 
      username: 'admin_abc', 
      email: 'admin@abcorg.com',
      role: 'admin', 
      company: 'ABC Organization' 
    },
    { 
      id: 'admin2', 
      username: 'admin_xyz', 
      email: 'admin@xyzcompany.com',
      role: 'admin', 
      company: 'XYZ Company' 
    },
    { 
      id: 'admin3', 
      username: 'admin_xxx', 
      email: 'admin@xxxinc.com',
      role: 'admin', 
      company: 'XXX Inc' 
    },
  ]);

  const signup = (username: string, email: string, password: string, company: string) => {
    // In a real app, this would validate against a backend
    // For demo purposes, we'll simulate a successful signup
    const userId = Math.random().toString(36).substring(2, 10);
    const newUser: User = { 
      id: userId, 
      username, 
      email,
      role: 'user', 
      company 
    };
    
    setUsers([...users, newUser]);
    setUser(newUser); // Auto login after signup
  };

  const login = (username: string, password: string, role: 'user' | 'admin', company?: string) => {
    // In a real app, this would validate against a backend
    // For demo purposes, check if user exists in our local "database"
    const foundUser = users.find(u => u.username === username);
    
    if (foundUser) {
      setUser(foundUser);
    } else {
      // If user not found, create a temporary one (for demo purposes)
      const userId = Math.random().toString(36).substring(2, 10);
      const tempUser: User = { 
        id: userId, 
        username, 
        email: '', 
        role: role as 'user' | 'admin', 
        company 
      };
      setUser(tempUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, users, login, signup, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
