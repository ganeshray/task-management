import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          setIsAuthenticated(true)
          setUser({ email, name: 'John Doe' })
          resolve({ success: true })
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 1000)
    })
  }

  const register = async (userData) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (userData.email && userData.password) {
          resolve({ success: true, message: 'Registration successful' })
        } else {
          reject(new Error('Registration failed'))
        }
      }, 1000)
    })
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
  }

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
