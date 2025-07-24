import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced token validation with additional checks
  const validateToken = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp < currentTime) {
        throw new Error('Token expired');
      }
      
      return { 
        ...decoded, 
        token,
        id: decoded.userId || decoded.sub || decoded.id,
        isAuthenticated: true
      };
    } catch (err) {
      console.error("Token validation failed:", err.message);
      throw err;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const validatedUser = validateToken(token);
        
        // Verify token with backend
        await axios.get('/api/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(validatedUser);
      } catch (err) {
        console.error("Authentication initialization failed:", err);
        localStorage.removeItem('token');
        setUser(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [validateToken]);

  const login = async (userData, remember = true) => {
    try {
      const validatedUser = validateToken(userData.token);
      
      if (remember) {
        localStorage.setItem('token', userData.token);
      }
      
      setUser(validatedUser);
      setError(null);
      return true;
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    // Optional: Add API call to invalidate token on server
    // axios.post('/api/auth/logout');
  }, []);

  // Function to refresh user data (for profile updates)
  const refreshUser = useCallback(async () => {
    if (!user?.token) return;
    
    try {
      const response = await axios.get(`/api/users/${user.id}/full-profile`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      
      setUser(prev => ({
        ...prev,
        ...response.data,
        token: prev.token,
        isAuthenticated: true
      }));
      setError(null);
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      setError(err.response?.data?.message || "Failed to refresh profile");
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!user?.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}