import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import s from './Admin.module.css'

export default function Admin() {
  const { config, saveConfig, logout } = useApp()
  const navigate = useNavigate()

  const [keys,    setKeys]    = useState({ groqKey: config.groqKey || '', pexelsKey: config.pexelsKey || '' })
  const [show,    setShow]    = useState({ groq: false, pexels: false })
  const [saved,   setSaved]   = useState(false)
  const [tab,     setTab]     = useState('keys') // keys | users | plans | stats

  // Get all users from localStorage
  const users = JSON.parse(localStorage.getItem('vb_users') || '[]')

  const handleSaveKeys = () => {
    saveConfig({ groqKey: keys.groqKey.trim(), pexelsKey: keys.pexelsKey.trim() })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const updateUserPlan = (email, plan) => {
    const updated = users.map(u => u.email === email ? { ...u, plan } : u)
    localStorage.setItem('vb_users', JSON.stringify(updated))
    window.location.reload()
  }

  const deleteUser = (email) => {
    if (!window.confirm(`Delete user ${email}?`)) return
    const updated = users.filter(u => u.email !== email)
    localStorage.setItem('vb_users', JSON.stringify(updated))
    window.location.reload()
  }

  const TABS = [
    { id: 'keys',  icon: '🔑', label: 'API Keys'      },
    { id: 'users', icon: '👥', label: 'Users'          },
    { id: 'plans', icon: '💎', label: 'Plan Config'    },
    { id: 'stats', icon: '📊', label: 'Stats'          },
  ]

  const totalUsers   = users.length
  const proUsers     = users.filter(u => u.plan === 'pro').length
  const bizUsers     = users.filter(u => u.plan === 'biz').length
  const freeUsers    = users.filter(u => u.plan === 'free').length
  const monthlyRev   = (proUsers * 299) + (bizUsers * 799)

  return (
    <div className={s.page}>
      {/* Top bar */}
      <div className={s.topbar}>
        <div className={s.topLeft}>
          <div className={s.logo}>
            <div className={s.logoMark}>V</div>
            <span>Viral<span>Box</span>.ai</span>
          </div>
          <div className={s.adminBadge}>🔐 ADMIN PANEL</div>
        </div>
        <div className={s.topRight}>
          <button className={s.siteBtn} onClick={() => navigate('/dashboard')}>← Go to Site</button>
          <button className={s.logoutBtn} onClick={() => { logout(); navigate('/') }}>Logout</button>
        </div>
      </div>

      <div className={s.layout}>
        {/* Sidebar tabs */}
        <aside className={s.sidebar}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${s.tabBtn} ${tab === t.id ? s.tabActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <div className={s.content}>

          {/* ── API KEYS ── */}
          {tab === 'keys' && (
            <div className={s.section}>
              <div className={s.sectionTitle}>🔑 API Keys Configuration</div>
              <div className={s.sectionSub}>These keys power all AI features for your users. Only you can see and edit them.</div>

              <div className={s.keyCard}>
                <div className={s.keyTop}>
                  <div className={s.keyInfo}>
                    <div className={s.keyName}>🤖 Groq API Key</div>
                    <div className={s.keyDesc}>Powers all AI script writing for every user — free tier</div>
                  </div>
                  <a href="https://console.groq.com" target="_blank" rel="noreferrer" className={s.getBtn}>Get Key →</a>
                </div>
                <div className={s.keyRow}>
                  <input
                    type={show.groq ? 'text' : 'password'}
                    value={keys.groqKey}
                    onChange={e => setKeys(p => ({ ...p, groqKey: e.target.value }))}
                    placeholder="gsk_..."
                  />
                  <button className={s.showBtn} onClick={() => setShow(p => ({ ...p, groq: !p.groq }))}>
                    {show.groq ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className={`${s.keyStatus} ${keys.groqKey ? s.ok : s.missing}`}>
                  {keys.groqKey ? '✅ Key configured — AI features active' : '⚠️ Missing — users cannot generate videos'}
                </div>
              </div>

              <div className={s.keyCard}>
                <div className={s.keyTop}>
                  <div className={s.keyInfo}>
                    <div className={s.keyName}>📹 Pexels API Key</div>
                    <div className={s.keyDesc}>Free stock footage for all videos — unlimited</div>
                  </div>
                  <a href="https://www.pexels.com/api" target="_blank" rel="noreferrer" className={s.getBtn}>Get Key →</a>
                </div>
                <div className={s.keyRow}>
                  <input
                    type={show.pexels ? 'text' : 'password'}
                    value={keys.pexelsKey}
                    onChange={e => setKeys(p => ({ ...p, pexelsKey: e.target.value }))}
                    placeholder="Your Pexels API key..."
                  />
                  <button className={s.showBtn} onClick={() => setShow(p => ({ ...p, pexels: !p.pexels }))}>
                    {show.pexels ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className={`${s.keyStatus} ${keys.pexelsKey ? s.ok : s.missing}`}>
                  {keys.pexelsKey ? '✅ Key configured — footage fetching active' : '⚠️ Missing — videos will fail'}
                </div>
              </div>

              <button className={`${s.saveBtn} ${saved ? s.savedBtn : ''}`} onClick={handleSaveKeys}>
                {saved ? '✅ Saved Successfully!' : '💾 Save API Keys'}
              </button>

              <div className={s.secNote}>
                🔒 Keys are stored in browser localStorage. For production, store them in a secure backend (Firebase, Supabase, etc.)
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {tab === 'users' && (
            <div className={s.section}>
              <div className={s.sectionTitle}>👥 Registered Users</div>
              <div className={s.sectionSub}>{totalUsers} total users registered</div>

              {users.length === 0 ? (
                <div className={s.empty}>
                  <div className={s.emptyIcon}>👥</div>
                  <div>No users yet. Share your site to get signups!</div>
                </div>
              ) : (
                <div className={s.userTable}>
                  <div className={s.tableHeader}>
                    <span>Name</span>
                    <span>Email</span>
                    <span>Plan</span>
                    <span>Actions</span>
                  </div>
                  {users.map(u => (
                    <div key={u.email} className={s.tableRow}>
                      <span className={s.userName}>{u.name}</span>
                      <span className={s.userEmail}>{u.email}</span>
                      <div className={s.planSelect}>
                        <select
                          value={u.plan}
                          onChange={e => updateUserPlan(u.email, e.target.value)}
                          className={s.planDrop}
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="biz">Business</option>
                        </select>
                      </div>
                      <button className={s.deleteBtn} onClick={() => deleteUser(u.email)}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PLANS ── */}
          {tab === 'plans' && (
            <div className={s.section}>
              <div className={s.sectionTitle}>💎 Plan Configuration</div>
              <div className={s.sectionSub}>Current plan limits for each tier</div>

              <div className={s.planCards}>
                {[
                  { key:'free', name:'Free',     color:'#6b6b9a', videos:3,   price:0   },
                  { key:'pro',  name:'Pro',       color:'#a855f7', videos:30,  price:299 },
                  { key:'biz',  name:'Business',  color:'#f59e0b', videos:'∞', price:799 },
                ].map(p => (
                  <div key={p.key} className={s.planCard} style={{ borderColor: p.color + '40' }}>
                    <div className={s.planCardName} style={{ color: p.color }}>{p.name}</div>
                    <div className={s.planCardPrice}>
                      {p.price === 0 ? 'Free' : `₹${p.price}/mo`}
                    </div>
                    <div className={s.planCardVideos}>{p.videos} videos/month</div>
                    <div className={s.planUsers}>
                      {users.filter(u => u.plan === p.key).length} users on this plan
                    </div>
                  </div>
                ))}
              </div>

              <div className={s.infoBox}>
                💡 To change plan limits or prices, edit the <code>DEFAULT_CONFIG</code> in <code>src/context/AppContext.jsx</code>
              </div>
            </div>
          )}

          {/* ── STATS ── */}
          {tab === 'stats' && (
            <div className={s.section}>
              <div className={s.sectionTitle}>📊 Business Stats</div>
              <div className={s.sectionSub}>Overview of your ViralBox.ai platform</div>

              <div className={s.statsGrid}>
                <div className={s.statCard}>
                  <div className={s.statIcon}>👥</div>
                  <div className={s.statVal}>{totalUsers}</div>
                  <div className={s.statLabel}>Total Users</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statIcon}>💎</div>
                  <div className={s.statVal} style={{ color: '#a855f7' }}>{proUsers}</div>
                  <div className={s.statLabel}>Pro Users</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statIcon}>🏆</div>
                  <div className={s.statVal} style={{ color: '#f59e0b' }}>{bizUsers}</div>
                  <div className={s.statLabel}>Business Users</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statIcon}>💰</div>
                  <div className={s.statVal} style={{ color: '#10b981' }}>₹{monthlyRev.toLocaleString()}</div>
                  <div className={s.statLabel}>Monthly Revenue</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statIcon}>🆓</div>
                  <div className={s.statVal}>{freeUsers}</div>
                  <div className={s.statLabel}>Free Users</div>
                </div>
                <div className={s.statCard}>
                  <div className={s.statIcon}>📈</div>
                  <div className={s.statVal} style={{ color: '#a855f7' }}>
                    {totalUsers > 0 ? Math.round(((proUsers + bizUsers) / totalUsers) * 100) : 0}%
                  </div>
                  <div className={s.statLabel}>Conversion Rate</div>
                </div>
              </div>

              <div className={s.revenueCard}>
                <div className={s.revenueTitle}>💰 Revenue Breakdown</div>
                <div className={s.revenueRows}>
                  <div className={s.revenueRow}>
                    <span>Pro ({proUsers} users × ₹299)</span>
                    <span style={{ color: '#a855f7' }}>₹{(proUsers * 299).toLocaleString()}</span>
                  </div>
                  <div className={s.revenueRow}>
                    <span>Business ({bizUsers} users × ₹799)</span>
                    <span style={{ color: '#f59e0b' }}>₹{(bizUsers * 799).toLocaleString()}</span>
                  </div>
                  <div className={`${s.revenueRow} ${s.revenueTotal}`}>
                    <span>Total Monthly Revenue</span>
                    <span style={{ color: '#10b981' }}>₹{monthlyRev.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
