import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, logout as logoutApi } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      setLoading(true)
      const response = await getProfile()
      setUser(response.user)
    } catch (err) {
      // User is not authenticated (401) or network error
      // Silently handle expected 401 errors (user not logged in)
      // Only log unexpected errors
      if (err.status !== 401 && !err.isNetworkError) {
        console.error('Auth check error:', err)
      }
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  function login(userData) {
    setUser(userData)
  }

  async function logout() {
    try {
      await logoutApi()
    } catch (err) {
      // Even if logout API fails, clear local state
      console.error('Logout error:', err)
    } finally {
      setUser(null)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

