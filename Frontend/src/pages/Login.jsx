import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: hook up to API
    console.log('Login form submitted', form)
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

            <button type="submit" className="btn-block">Sign in</button>
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