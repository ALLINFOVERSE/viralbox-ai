import { createContext, useContext, useState } from 'react'

const AppCtx = createContext(null)

// ── ADMIN CONFIG (stored in localStorage, set from Admin panel) ──
// In production you'd fetch this from a secure backend
const DEFAULT_CONFIG = {
  groqKey:   '',
  pexelsKey: '',
  adminPass: 'viralbox2024', // change this!
  plans: {
    free: { videos: 3,         label: 'Free',     price: 0   },
    pro:  { videos: 30,        label: 'Pro',       price: 299 },
    biz:  { videos: 9999,      label: 'Business',  price: 799 },
  }
}

export function AppProvider({ children }) {
  // Admin config (API keys etc — set by you, not visible to users)
  const [config, setConfig] = useState(() => {
    try { return { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem('vb_config') || '{}') } }
    catch { return DEFAULT_CONFIG }
  })

  // Current logged-in user (simulated)
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vb_user') || 'null') }
    catch { return null }
  })

  // Videos used this month
  const [usage, setUsage] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vb_usage') || '{"count":0,"month":""}') }
    catch { return { count: 0, month: '' } }
  })

  const saveConfig = (cfg) => {
    const merged = { ...config, ...cfg }
    setConfig(merged)
    localStorage.setItem('vb_config', JSON.stringify(merged))
  }

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('vb_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('vb_user')
  }

  const incrementUsage = () => {
    const now = new Date().toISOString().slice(0, 7)
    const updated = usage.month === now
      ? { count: usage.count + 1, month: now }
      : { count: 1, month: now }
    setUsage(updated)
    localStorage.setItem('vb_usage', JSON.stringify(updated))
  }

  const getUsageLimit = () => {
    if (!user) return 0
    return config.plans[user.plan]?.videos || 3
  }

  const canGenerate = () => {
    if (!user) return false
    const limit = getUsageLimit()
    if (limit === 9999) return true
    const now = new Date().toISOString().slice(0, 7)
    const thisMonth = usage.month === now ? usage.count : 0
    return thisMonth < limit
  }

  const videosLeft = () => {
    const limit = getUsageLimit()
    if (limit === 9999) return '∞'
    const now = new Date().toISOString().slice(0, 7)
    const used = usage.month === now ? usage.count : 0
    return Math.max(0, limit - used)
  }

  return (
    <AppCtx.Provider value={{
      config, saveConfig,
      user, login, logout,
      usage, incrementUsage,
      canGenerate, videosLeft, getUsageLimit,
    }}>
      {children}
    </AppCtx.Provider>
  )
}

export const useApp = () => useContext(AppCtx)
