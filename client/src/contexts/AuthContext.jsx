import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const validateToken = useCallback((token) => {
    try {
      if (!token) return null;

      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        return null;
      }

      return decoded;
    } catch (err) {
      return null;
    }
  }, []);

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      loading: false,
      error: null
    });
  }, []);

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      setAuthState({ user: null, loading: false, error: null });
      return;
    }

    const decoded = validateToken(token);
    if (!decoded) {
      logout();
      return;
    }

    let parsedUser = null;
    try {
      parsedUser = userData ? JSON.parse(userData) : null;
    } catch (err) {
      logout();
      return;
    }

    setAuthState({
      user: parsedUser ? { ...parsedUser, isAuthenticated: true } : null,
      loading: true,
      error: null
    });

    try {
      const verifiedUser = await verifyToken(token);
      const completeUser = {
        ...verifiedUser.user,
        isAuthenticated: true
      };

      setAuthState({
        user: completeUser,
        loading: false,
        error: null
      });
      localStorage.setItem('user', JSON.stringify(completeUser));
    } catch (err) {
      console.warn("⚠️ Token backend verification failed. Logging out.");
      logout();
    }
  }, [validateToken, verifyToken, logout]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (email, password, remember = true) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      const user = {
        ...data.user,
        token: data.token,
        isAuthenticated: true
      };

      if (remember) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
      }

      setAuthState({
        user,
        loading: false,
        error: null
      });

      return true;
    } catch (err) {
      setAuthState({
        user: null,
        loading: false,
        error: err.message
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      isAuthenticated: authState.user?.isAuthenticated || false
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
