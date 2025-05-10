
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type User = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  company?: string; // Company association for the user
};

// Mock company emails for forwarding
export const companyEmails: Record<string, string> = {
  'ABC Organization': 'admin@abcorg.com',
  'XYZ Company': 'admin@xyzcompany.com',
  'XXX Inc': 'admin@xxxinc.com',
  'DEF Corporation': 'admin@defcorp.com',
  'GHI Enterprises': 'admin@ghient.com'
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string, role: 'user' | 'admin', company?: string) => void;
  signup: (username: string, email: string, password: string, company: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  users: User[]; // Store all users (for demo purposes)
  getCompanyEmail: (company: string) => string;
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
    // Pre-populated super admin user
    { 
      id: 'superadmin', 
      username: 'admin', 
      email: 'admin@feedbackhub.com',
      role: 'admin',
      // No company for super admin - can see all feedbacks
    },
    // Pre-populated company users
    { 
      id: 'user1', 
      username: 'user_abc', 
      email: 'user@abcorg.com',
      role: 'user', 
      company: 'ABC Organization' 
    },
    { 
      id: 'user2', 
      username: 'user_xyz', 
      email: 'user@xyzcompany.com',
      role: 'user', 
      company: 'XYZ Company' 
    },
    { 
      id: 'user3', 
      username: 'user_xxx', 
      email: 'user@xxxinc.com',
      role: 'user', 
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

  // Helper function to get company email
  const getCompanyEmail = (company: string): string => {
    return companyEmails[company] || 'contact@company.com';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      signup, 
      logout, 
      isAuthenticated, 
      isAdmin, 
      getCompanyEmail 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
