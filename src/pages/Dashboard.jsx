import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import s from './Dashboard.module.css'

export default function Dashboard() {
  const { user, videosLeft, getUsageLimit, canGenerate } = useApp()
  const navigate = useNavigate()
  const limit    = getUsageLimit()
  const left     = videosLeft()
  const used     = limit === 9999 ? 0 : Math.max(0, limit - (typeof left === 'number' ? left : 0))
  const pct      = limit === 9999 ? 10 : Math.min(100, (used / limit) * 100)

  const planColors = { free:'#6b6b9a', pro:'#a855f7', biz:'#f59e0b' }
  const planColor  = planColors[user?.plan] || '#6b6b9a'

  return (
    <div className={s.page}>
      {/* Welcome */}
      <div className={s.welcome}>
        <div>
          <div className={s.welcomeTag}>WELCOME BACK</div>
          <h1 className={s.welcomeTitle}>Hey, {user?.name?.split(' ')[0]} 👋</h1>
          <p className={s.welcomeSub}>Ready to create your next viral video?</p>
        </div>
        <button className={s.createBtn} onClick={() => navigate('/ceo-cabin')}>
          🎬 Go to CEO Cabin
        </button>
      </div>

      {/* Plan card */}
      <div className={s.planCard} style={{ borderColor: planColor + '40' }}>
        <div className={s.planLeft}>
          <div className={s.planBadge} style={{ background: planColor + '20', color: planColor, borderColor: planColor + '40' }}>
            {user?.plan?.toUpperCase()} PLAN
          </div>
          <div className={s.planTitle}>Videos this month</div>
          <div className={s.planUsage}>
            <span className={s.planUsed} style={{ color: planColor }}>{used}</span>
            <span className={s.planSlash}>/</span>
            <span className={s.planMax}>{limit === 9999 ? '∞' : limit}</span>
          </div>
          <div className={s.progressBar}>
            <div className={s.progressFill} style={{ width:`${pct}%`, background:planColor }} />
          </div>
        </div>
        <div className={s.planRight}>
          <div className={s.videosLeft}>{left}</div>
          <div className={s.videosLeftLabel}>videos remaining</div>
          {user?.plan === 'free' && (
            <button className={s.upgradeBtn} onClick={() => navigate('/pricing')}>
              ⚡ Upgrade Plan
            </button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className={s.quickTitle}>Quick Actions</div>
      <div className={s.quickGrid}>
        <div className={`${s.quickCard} ${s.quickMain}`} onClick={() => navigate('/ceo-cabin')}>
          <div className={s.quickIcon}>🎬</div>
          <div className={s.quickName}>CEO Cabin</div>
          <div className={s.quickDesc}>Create a new AI video from your idea</div>
          <div className={s.quickArrow}>→</div>
        </div>
        <div className={s.quickCard} onClick={() => navigate('/agents')}>
          <div className={s.quickIcon}>🤖</div>
          <div className={s.quickName}>AI Agents</div>
          <div className={s.quickDesc}>Chat with your 8 specialist agents</div>
          <div className={s.quickArrow}>→</div>
        </div>
        <div className={s.quickCard} onClick={() => navigate('/pricing')}>
          <div className={s.quickIcon}>💎</div>
          <div className={s.quickName}>Upgrade</div>
          <div className={s.quickDesc}>Get more videos with Pro or Business</div>
          <div className={s.quickArrow}>→</div>
        </div>
      </div>

      {/* Features reminder */}
      <div className={s.tipsTitle}>What you can create</div>
      <div className={s.tipsGrid}>
        {[
          { icon:'📱', label:'Instagram Reels', desc:'30s vertical videos' },
          { icon:'▶️', label:'YouTube Shorts',  desc:'60s viral shorts'    },
          { icon:'🎥', label:'Product Videos',  desc:'Cinematic showcases' },
          { icon:'💡', label:'Faceless Content',desc:'Zero face required'  },
        ].map(t => (
          <div key={t.label} className={s.tip}>
            <div className={s.tipIcon}>{t.icon}</div>
            <div className={s.tipLabel}>{t.label}</div>
            <div className={s.tipDesc}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
