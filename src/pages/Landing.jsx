import { useNavigate } from 'react-router-dom'
import s from './Landing.module.css'

const FEATURES = [
  { icon:'🎬', title:'CEO Cabin',        desc:'Tell the AI exactly what you want — mood, style, audience. It plans everything.' },
  { icon:'🎭', title:'Scene Planning',   desc:'AI breaks your idea into cinematic scenes automatically with perfect pacing.' },
  { icon:'🎙️', title:'Neural Voice',     desc:'Deep, emotional Microsoft neural voices — sounds like a real narrator.' },
  { icon:'📹', title:'Auto Footage',     desc:'AI fetches perfect stock clips from millions of free videos on Pexels.' },
  { icon:'✂️', title:'Auto Edit',        desc:'Combines everything with fade effects, text overlay, and professional pacing.' },
  { icon:'📝', title:'Caption Ready',    desc:'Every video comes with caption + hashtags ready to paste and post.' },
]

const PLANS = [
  {
    name:'Free', price:0, color:'#6b6b9a',
    videos:3, features:['3 videos/month','Basic voices','720p quality','Caption + hashtags'],
    cta:'Start Free',
  },
  {
    name:'Pro', price:299, color:'#a855f7', popular:true,
    videos:30, features:['30 videos/month','All neural voices','1080p quality','Priority generation','No watermark'],
    cta:'Go Pro',
  },
  {
    name:'Business', price:799, color:'#f59e0b',
    videos:'Unlimited', features:['Unlimited videos','All voices + custom','4K quality','Bulk generation','Brand kit','Priority support'],
    cta:'Go Business',
  },
]

export default function Landing() {
  const navigate = useNavigate()
  return (
    <div className={s.page}>
      {/* NAVBAR */}
      <nav className={s.nav}>
        <div className={s.navLogo}>
          <div className={s.logoMark}>V</div>
          <span>Viral<span className={s.purple}>Box</span><span className={s.muted}>.ai</span></span>
        </div>
        <div className={s.navLinks}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <button className={s.loginBtn} onClick={() => navigate('/login')}>Login</button>
          <button className={s.ctaBtn}   onClick={() => navigate('/login')}>Start Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section className={s.hero}>
        <div className={s.heroBadge}>🚀 AI-Powered Video Creation</div>
        <h1 className={s.heroTitle}>
          Turn Any Idea Into a<br/>
          <span className={s.gradient}>Viral Video</span><br/>
          in Minutes
        </h1>
        <p className={s.heroSub}>
          Describe your video — ViralBox.ai plans the scenes, records the voiceover,
          finds the footage, and edits everything automatically.
          No editing skills needed.
        </p>
        <div className={s.heroActions}>
          <button className={s.heroCta} onClick={() => navigate('/login')}>
            🎬 Create Your First Video Free
          </button>
          <div className={s.heroNote}>No credit card • 3 free videos/month</div>
        </div>

        {/* DEMO WINDOW */}
        <div className={s.demoWindow}>
          <div className={s.demoBar}>
            <span /><span /><span />
            <div className={s.demoUrl}>viralbox.ai/ceo-cabin</div>
          </div>
          <div className={s.demoBody}>
            <div className={s.demoPrompt}>
              <div className={s.demoLabel}>🎬 What's your video about?</div>
              <div className={s.demoInput}>Samsung Galaxy A35 cinematic showcase for tech lovers</div>
            </div>
            <div className={s.demoScenes}>
              {[
                { n:'01', t:'HOOK',    tx:'Cinematic reveal of the device...', c:'#a855f7' },
                { n:'02', t:'BUILDUP', tx:'Camera features close-up shots...', c:'#3b82f6' },
                { n:'03', t:'CLIMAX',  tx:'Action shots, performance demo...', c:'#10b981' },
                { n:'04', t:'CTA',     tx:'End card with brand message...',   c:'#f59e0b' },
              ].map(sc => (
                <div key={sc.n} className={s.demoScene}>
                  <span className={s.demoSceneN} style={{ color: sc.c }}>Scene {sc.n}</span>
                  <span className={s.demoSceneT} style={{ borderColor: sc.c, color: sc.c }}>{sc.t}</span>
                  <span className={s.demoSceneTx}>{sc.tx}</span>
                </div>
              ))}
            </div>
            <div className={s.demoGenBtn}>✅ Generating your video... 78%</div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className={s.section} id="features">
        <div className={s.sectionTag}>EVERYTHING YOU NEED</div>
        <h2 className={s.sectionTitle}>One Prompt. Full Video.</h2>
        <div className={s.featGrid}>
          {FEATURES.map(f => (
            <div key={f.title} className={s.featCard}>
              <div className={s.featIcon}>{f.icon}</div>
              <div className={s.featTitle}>{f.title}</div>
              <div className={s.featDesc}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={s.section}>
        <div className={s.sectionTag}>HOW IT WORKS</div>
        <h2 className={s.sectionTitle}>3 Steps to Your Video</h2>
        <div className={s.steps}>
          {[
            { n:'01', icon:'💬', t:'Describe',  d:'Enter your topic, mood, audience, and duration in the CEO Cabin' },
            { n:'02', icon:'🤖', t:'AI Plans',  d:'Our AI Director plans cinematic scenes and approves them with you' },
            { n:'03', icon:'🎉', t:'Get Video', d:'Download your ready-to-post video with caption and hashtags' },
          ].map(st => (
            <div key={st.n} className={s.step}>
              <div className={s.stepN}>{st.n}</div>
              <div className={s.stepIcon}>{st.icon}</div>
              <div className={s.stepT}>{st.t}</div>
              <div className={s.stepD}>{st.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className={s.section} id="pricing">
        <div className={s.sectionTag}>SIMPLE PRICING</div>
        <h2 className={s.sectionTitle}>Start Free. Scale as You Grow.</h2>
        <div className={s.plans}>
          {PLANS.map(p => (
            <div key={p.name} className={`${s.planCard} ${p.popular ? s.planPopular : ''}`}>
              {p.popular && <div className={s.popularBadge}>⭐ MOST POPULAR</div>}
              <div className={s.planName} style={{ color: p.color }}>{p.name}</div>
              <div className={s.planPrice}>
                {p.price === 0 ? 'Free' : <>₹{p.price}<span>/mo</span></>}
              </div>
              <div className={s.planVideos} style={{ color: p.color }}>{p.videos} videos/month</div>
              <div className={s.planFeatures}>
                {p.features.map(f => <div key={f} className={s.planFeature}>✓ {f}</div>)}
              </div>
              <button
                className={s.planCta}
                style={{ background: p.popular ? p.color : 'transparent', borderColor: p.color, color: p.popular ? 'white' : p.color }}
                onClick={() => navigate('/login')}
              >{p.cta}</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={s.footer}>
        <div className={s.footerLogo}>
          <div className={s.logoMark}>V</div>
          <span>ViralBox.ai</span>
        </div>
        <div className={s.footerNote}>© 2024 ViralBox.ai — AI Video Generator</div>
      </footer>
    </div>
  )
}
