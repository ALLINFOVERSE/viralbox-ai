import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import s from './Login.module.css'

export default function Login() {
  const { login } = useApp()
  const navigate  = useNavigate()
  const [mode,    setMode]  = useState('login') // login | signup
  const [form,    setForm]  = useState({ name:'', email:'', password:'' })
  const [error,   setError] = useState('')

  const ADMIN_EMAIL = 'admin@viralbox.ai'
  const ADMIN_PASS  = 'viralbox2024'

  const handle = () => {
    if (!form.email || !form.password) { setError('Fill in all fields'); return }

    // Admin check
    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASS) {
      login({ name:'Admin', email: ADMIN_EMAIL, plan:'biz', isAdmin:true })
      navigate('/admin')
      return
    }

    // Regular user (simulated — in production connect to Firebase)
    if (mode === 'signup' && !form.name) { setError('Enter your name'); return }

    const users = JSON.parse(localStorage.getItem('vb_users') || '[]')

    if (mode === 'signup') {
      if (users.find(u => u.email === form.email)) { setError('Email already exists!'); return }
      const newUser = { name: form.name, email: form.email, password: form.password, plan:'free', isAdmin:false }
      localStorage.setItem('vb_users', JSON.stringify([...users, newUser]))
      login(newUser)
      navigate('/dashboard')
    } else {
      const found = users.find(u => u.email === form.email && u.password === form.password)
      if (!found) { setError('Wrong email or password'); return }
      login(found)
      navigate('/dashboard')
    }
  }

  return (
    <div className={s.page}>
      <div className={s.card}>
        {/* Logo */}
        <div className={s.logo}>
          <div className={s.mark}>V</div>
          <span>Viral<span>Box</span>.ai</span>
        </div>

        <div className={s.title}>{mode === 'login' ? 'Welcome back' : 'Create account'}</div>
        <div className={s.sub}>{mode === 'login' ? 'Login to your account' : 'Start creating viral videos today'}</div>

        {error && <div className={s.error}>{error}</div>}

        <div className={s.fields}>
          {mode === 'signup' && (
            <input
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            />
          )}
          <input
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handle()}
          />
        </div>

        <button className={s.btn} onClick={handle}>
          {mode === 'login' ? 'Login →' : 'Create Account →'}
        </button>

        <div className={s.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up free' : 'Login'}
          </button>
        </div>

        <div className={s.note}>3 free videos every month • No credit card needed</div>
      </div>
    </div>
  )
}
