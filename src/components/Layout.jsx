import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import s from './Layout.module.css'

const NAV = [
  { to: '/dashboard', icon: '⚡', label: 'Dashboard'  },
  { to: '/ceo-cabin', icon: '🎬', label: 'CEO Cabin'  },
  { to: '/agents',    icon: '🤖', label: 'AI Agents'  },
  { to: '/pricing',   icon: '💎', label: 'Upgrade'    },
]

export default function Layout({ children }) {
  const { user, logout, videosLeft, config } = useApp()
  const navigate = useNavigate()

  const planColors = { free: '#6b6b9a', pro: '#a855f7', biz: '#f59e0b' }
  const planColor  = planColors[user?.plan] || '#6b6b9a'

  return (
    <div className={s.wrap}>
      {/* SIDEBAR */}
      <aside className={s.sidebar}>
        {/* Logo */}
        <div className={s.logo} onClick={() => navigate('/')}>
          <div className={s.logoMark}>V</div>
          <div className={s.logoText}>Viral<span>Box</span><em>.ai</em></div>
        </div>

        {/* User pill */}
        <div className={s.userPill}>
          <div className={s.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className={s.userInfo}>
            <div className={s.userName}>{user?.name || 'User'}</div>
            <div className={s.userPlan} style={{ color: planColor }}>
              {user?.plan?.toUpperCase() || 'FREE'} PLAN
            </div>
          </div>
        </div>

        {/* Videos left */}
        <div className={s.usageBox}>
          <div className={s.usageLabel}>Videos Left</div>
          <div className={s.usageVal} style={{ color: planColor }}>{videosLeft()}</div>
          <div className={s.usageSub}>this month</div>
        </div>

        {/* Nav */}
        <nav className={s.nav}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `${s.navItem} ${isActive ? s.active : ''}`}
            >
              <span className={s.navIcon}>{icon}</span>
              <span className={s.navLabel}>{label}</span>
            </NavLink>
          ))}
          {user?.isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `${s.navItem} ${s.adminItem} ${isActive ? s.active : ''}`}>
              <span className={s.navIcon}>🔐</span>
              <span className={s.navLabel}>Admin Panel</span>
            </NavLink>
          )}
        </nav>

        {/* Bottom */}
        <div className={s.bottom}>
          <button className={s.logoutBtn} onClick={logout}>
            ← Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={s.main}>{children}</main>

      {/* MOBILE NAV */}
      <nav className={s.mobileNav}>
        {NAV.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => `${s.mobileItem} ${isActive ? s.active : ''}`}>
            <span>{icon}</span>
            <span className={s.mobileLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
