import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ ...decoded, token });
      } catch (err) {
        console.error("Invalid token found in localStorage. Logging out.");
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = (userData, remember = true) => {
    if (remember) {
      localStorage.setItem('token', userData.token);
    }
    try {
      const decoded = jwtDecode(userData.token);
      setUser({ ...decoded, token: userData.token });
    } catch (err) {
      console.error("Invalid token during login");
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
