import { useState, useEffect } from 'react';

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '103020';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const login = (username: string, password: string) => {
    if (username.toLowerCase() === ADMIN_USER && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('auth', 'true');
      window.location.reload(); // Force page reload after login
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth');
    window.location.reload(); // Force page reload after logout
  };

  return { isAuthenticated, login, logout };
}