// src/context/AuthContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  user: { _id: string; username: string } | null;
  login: (user: { _id: string; username: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ _id: string; username: string } | null>(null);

  const login = (user: { _id: string; username: string }) => {
    setUser(user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
