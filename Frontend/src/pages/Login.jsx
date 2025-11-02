import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRequest } from '../utils/api.js'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      })
      navigate('/home')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="card form-card" role="region" aria-label="Login">
          <div className="form-header">
            <h1 style={{ margin: 0 }}>Welcome back</h1>
            <p className="muted">Sign in to continue.</p>
          </div>

          <form className="form" onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="input"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            {error ? <div className="error" role="alert" style={{ marginBottom: '16px' }}>{error}</div> : null}

            <button type="submit" className="btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="form-footer">
            <span>Don’t have an account? </span>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  )
}