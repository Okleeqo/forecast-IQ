import { useState } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // For demo purposes, always authenticated

  const logout = () => {
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    logout
  };
}