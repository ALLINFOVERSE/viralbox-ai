// ── PRICING ──────────────────────────────────────────────────
import s from './Pricing.module.css'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'

const PLANS = [
  { key:'free', name:'Free',     price:0,   videos:3,        color:'#6b6b9a', features:['3 videos/month','Basic neural voices','1080p output','Caption + hashtags','Community support'] },
  { key:'pro',  name:'Pro',      price:299, videos:30,       color:'#a855f7', popular:true, features:['30 videos/month','All 6 neural voices','1080p HD output','Priority generation','No watermark','Email support'] },
  { key:'biz',  name:'Business', price:799, videos:'Unlimited', color:'#f59e0b', features:['Unlimited videos','All voices + priority','4K output','Bulk generation','Brand kit','Dedicated support','API access'] },
]

export function Pricing() {
  const { user } = useApp()
  const navigate = useNavigate()
  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.tag}>PLANS</div>
        <h1 className={s.title}>Simple, Transparent Pricing</h1>
        <p className={s.sub}>Start free. Upgrade when you're ready to scale.</p>
      </div>
      <div className={s.grid}>
        {PLANS.map(p=>(
          <div key={p.key} className={`${s.card} ${p.popular?s.popular:''}`}>
            {p.popular && <div className={s.badge}>⭐ MOST POPULAR</div>}
            <div className={s.planName} style={{color:p.color}}>{p.name}</div>
            <div className={s.planPrice}>{p.price===0?'Free':<>₹{p.price}<span>/mo</span></>}</div>
            <div className={s.planVid} style={{color:p.color}}>{p.videos} videos/month</div>
            <div className={s.features}>{p.features.map(f=><div key={f} className={s.feat}>✓ {f}</div>)}</div>
            <button
              className={s.btn}
              style={p.popular?{background:p.color,border:'none',color:'white'}:{borderColor:p.color,color:p.color}}
              onClick={()=>navigate(user?'/dashboard':'/login')}
            >
              {user?.plan===p.key ? 'Current Plan' : p.price===0 ? 'Start Free' : `Get ${p.name}`}
            </button>
          </div>
        ))}
      </div>
      <div className={s.note}>All plans include: CEO Cabin • AI Scene Planning • Neural Voice • Pexels Footage • FFmpeg Editing</div>
    </div>
  )
}

export default Pricing
