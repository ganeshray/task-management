import React, { createContext, useContext, useState } from 'react'
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context;
}
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const login = async (email, password) => {
    try {
  const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  setIsAuthenticated(true);
  setUser({ _id: data._id, name: data.name, email: data.email });
  setToken(data.token);
  localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  }

  // Removed leftover simulated API code
  const register = async (userData) => {
    try {
  const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.firstName + ' ' + userData.lastName,
          email: userData.email,
          password: userData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
  setIsAuthenticated(false);
  setUser(null);
  setToken(null);
  localStorage.removeItem('token');
  }

  const value = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ...existing code...
export default AuthContext
