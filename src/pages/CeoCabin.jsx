import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import s from './CeoCabin.module.css'

const MOODS   = ['Cinematic & Dramatic','Energetic & Hype','Emotional & Inspiring','Luxury & Premium','Dark & Mysterious','Motivational & Bold','Calm & Peaceful','Fun & Upbeat']
const DURS    = [{ v:30,l:'30s',sub:'Reel' },{ v:60,l:'60s',sub:'Short' },{ v:90,l:'90s',sub:'Story' }]
const VOICES  = [
  { id:'en-US-GuyNeural',         icon:'🎙️', name:'Deep Confident', desc:'Cinematic male' },
  { id:'en-US-ChristopherNeural', icon:'📺', name:'Professional',   desc:'News anchor'   },
  { id:'en-GB-RyanNeural',        icon:'🎩', name:'British Male',   desc:'Smooth & cool' },
  { id:'en-US-JennyNeural',       icon:'🌸', name:'Soft Female',    desc:'Warm voice'    },
  { id:'en-US-AriaNeural',        icon:'✨', name:'Expressive',     desc:'Emotional'     },
]
const TYPES   = ['Instagram Reel','YouTube Short','Product Showcase','Motivational','Tutorial / Tips','Brand Story']
const STEPS   = ['📋 Brief','🎭 Scene Plan','🎬 Generating','🎉 Done']
const TYPE_COLORS = { hook:'#a855f7', buildup:'#3b82f6', climax:'#ef4444', cta:'#10b981' }

// ── Backend URL — change this after deploying to Railway ──────
const API = import.meta.env.VITE_API_URL || "http://localhost:5000"

export default function CeoCabin() {
  const { config, canGenerate, incrementUsage } = useApp()
  const navigate = useNavigate()

  const [step,     setStep]     = useState(0)
  const [brief,    setBrief]    = useState({ topic:'', mood:MOODS[0], audience:'', duration:60, voice:VOICES[0], type:TYPES[0], extras:'' })
  const [plan,     setPlan]     = useState(null)
  const [log,      setLog]      = useState([])
  const [done,     setDone]     = useState(null)
  const [err,      setErr]      = useState('')
  const [planning, setPlanning] = useState(false)
  const [jobId,    setJobId]    = useState(null)
  const [progress, setProgress] = useState(0)

  const addLog = (t, m) => setLog(p => [...p, { t, m }])

  // ── STEP 0→1: Plan Scenes via backend ────────────────────────
  const goToStep1 = async () => {
    if (!brief.topic.trim()) { setErr('Please enter your video topic!'); return }
    if (!canGenerate())      { setErr('No videos left this month. Upgrade to continue!'); return }
    setErr(''); setPlanning(true); setStep(1); setPlan(null)
    try {
      const res = await fetch(`${API}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic:    brief.topic,
          mood:     brief.mood,
          audience: brief.audience,
          duration: brief.duration,
          extras:   brief.extras,
          type:     brief.type,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Planning failed')
      setPlan(data.plan)
    } catch(e) {
      setErr(`Planning failed: ${e.message}`)
      setStep(0)
    } finally { setPlanning(false) }
  }

  // ── STEP 1→2: Start video generation job ────────────────────
  const goToStep2 = async () => {
    setStep(2); setLog([]); setProgress(0)
    addLog('info', '🚀 Sending to ViralBox server...')

    try {
      // Start job
      const res = await fetch(`${API}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, voice: brief.voice.id })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to start')

      const jid = data.job_id
      setJobId(jid)
      addLog('info', `🎬 Job started: ${jid}`)

      // Poll status every 2 seconds
      await pollJob(jid)

    } catch(e) {
      addLog('err', `❌ ${e.message}`)
      setErr(e.message)
    }
  }

  const pollJob = async (jid) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(async () => {
        try {
          const res  = await fetch(`${API}/api/status/${jid}`)
          const data = await res.json()

          setProgress(data.progress || 0)

          if (data.message) {
            setLog(p => {
              const last = p[p.length - 1]
              if (last?.m === data.message) return p
              return [...p, { t: data.status === 'error' ? 'err' : data.progress === 100 ? 'done' : data.progress > 50 ? 'scene' : 'ok', m: data.message }]
            })
          }

          if (data.status === 'done') {
            clearInterval(interval)
            incrementUsage()
            setDone({
              jobId:    jid,
              title:    data.title,
              caption:  data.caption,
              hashtags: data.hashtags,
              scenes:   plan.scenes.length,
            })
            setStep(3)
            resolve()
          } else if (data.status === 'error') {
            clearInterval(interval)
            setErr(data.error || 'Generation failed')
            reject(new Error(data.error))
          }
        } catch(e) {
          clearInterval(interval)
          reject(e)
        }
      }, 2000)
    })
  }

  const replan = async () => {
    setPlanning(true); setPlan(null)
    try {
      const res  = await fetch(`${API}/api/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: brief.topic, mood: brief.mood,
          audience: brief.audience, duration: brief.duration,
          extras: brief.extras, type: brief.type,
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPlan(data.plan)
    } catch(e) { setErr(e.message) }
    finally    { setPlanning(false) }
  }

  const downloadVideo = () => {
    if (!jobId) return
    window.open(`${API}/api/download/${jobId}`, '_blank')
  }

  const downloadCaption = () => {
    if (!jobId) return
    window.open(`${API}/api/caption/${jobId}`, '_blank')
  }

  const reset = () => {
    setStep(0); setPlan(null); setLog([]); setDone(null)
    setErr(''); setJobId(null); setProgress(0)
    setBrief({ topic:'', mood:MOODS[0], audience:'', duration:60, voice:VOICES[0], type:TYPES[0], extras:'' })
  }

  const copy = txt => navigator.clipboard.writeText(txt)

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.tag}>CEO CABIN</div>
        <h1 className={s.title}>Your Video Command Center</h1>
        <p className={s.sub}>Tell me what you want — AI handles everything, video downloads automatically</p>
      </div>

      {/* Stepper */}
      <div className={s.stepper}>
        {STEPS.map((st, i) => (
          <div key={st} className={`${s.stepItem} ${i<=step?s.stepOn:''} ${i<step?s.stepDone:''}`}>
            <div className={s.stepCircle}>{i<step?'✓':i+1}</div>
            <div className={s.stepLabel}>{st}</div>
            {i<STEPS.length-1 && <div className={s.stepLine}/>}
          </div>
        ))}
      </div>

      {err && (
        <div className={s.err}>
          ⚠️ {err}
          {err.includes('Upgrade') && <button onClick={()=>navigate('/pricing')} className={s.errLink}>Upgrade →</button>}
        </div>
      )}

      {/* ── STEP 0: BRIEF ── */}
      {step===0 && (
        <div className={s.form}>
          <div className={s.card}>
            <div className={s.cardTitle}>🎯 What is your video about?</div>
            <textarea rows={3}
              placeholder='e.g. "A cinematic showcase of Samsung Galaxy A35 focusing on camera features for tech lovers"'
              value={brief.topic}
              onChange={e=>setBrief(p=>({...p,topic:e.target.value}))}
            />
          </div>

          <div className={s.row2}>
            <div className={s.card}>
              <div className={s.cardTitle}>📺 Video Type</div>
              <div className={s.chipGrid}>
                {TYPES.map(t=>(
                  <button key={t} className={`${s.chip} ${brief.type===t?s.chipOn:''}`} onClick={()=>setBrief(p=>({...p,type:t}))}>{t}</button>
                ))}
              </div>
            </div>
            <div className={s.card}>
              <div className={s.cardTitle}>⏱️ Duration</div>
              <div className={s.durRow}>
                {DURS.map(d=>(
                  <button key={d.v} className={`${s.durBtn} ${brief.duration===d.v?s.durOn:''}`} onClick={()=>setBrief(p=>({...p,duration:d.v}))}>
                    <span className={s.durL}>{d.l}</span>
                    <span className={s.durS}>{d.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardTitle}>🎭 Mood & Style</div>
            <div className={s.chipGrid}>
              {MOODS.map(m=>(
                <button key={m} className={`${s.chip} ${brief.mood===m?s.chipOn:''}`} onClick={()=>setBrief(p=>({...p,mood:m}))}>{m}</button>
              ))}
            </div>
          </div>

          <div className={s.row2}>
            <div className={s.card}>
              <div className={s.cardTitle}>👥 Target Audience</div>
              <input placeholder='e.g. Tech lovers aged 18-30' value={brief.audience} onChange={e=>setBrief(p=>({...p,audience:e.target.value}))} />
            </div>
            <div className={s.card}>
              <div className={s.cardTitle}>🎙️ Voice Style</div>
              <div className={s.voiceRow}>
                {VOICES.map(v=>(
                  <button key={v.id} className={`${s.voiceBtn} ${brief.voice.id===v.id?s.voiceOn:''}`} onClick={()=>setBrief(p=>({...p,voice:v}))}>
                    <span>{v.icon}</span>
                    <span className={s.voiceName}>{v.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={s.card}>
            <div className={s.cardTitle}>✨ Special Instructions <span className={s.opt}>(optional)</span></div>
            <input placeholder='e.g. Mention the price ₹25,000, end with a buy now CTA...' value={brief.extras} onChange={e=>setBrief(p=>({...p,extras:e.target.value}))} />
          </div>

          <button className={s.bigBtn} onClick={goToStep1}>🎬 Plan My Video →</button>
        </div>
      )}

      {/* ── STEP 1: SCENE PLAN ── */}
      {step===1 && (
        <div className={s.planWrap}>
          {planning || !plan ? (
            <div className={s.loading}>
              <div className={s.spinner}/>
              <div className={s.loadingTxt}>AI Director is planning your scenes...</div>
            </div>
          ) : (
            <>
              <div className={s.planCard}>
                <div className={s.planTitle}>{plan.video_title}</div>
                <div className={s.planStyle}>{plan.overall_style}</div>
                <div className={s.planMeta}>
                  <span>🎬 {plan.scenes.length} Scenes</span>
                  <span>⏱️ {brief.duration}s</span>
                  <span>🎙️ {brief.voice.name}</span>
                </div>
              </div>
              {plan.scenes.map(sc=>(
                <div key={sc.scene_number} className={s.sceneCard}>
                  <div className={s.sceneTop}>
                    <span className={s.sceneNum}>Scene {sc.scene_number}</span>
                    <span className={s.sceneType} style={{color:TYPE_COLORS[sc.scene_type]||'#a855f7',borderColor:(TYPE_COLORS[sc.scene_type]||'#a855f7')+'40'}}>{sc.scene_type.toUpperCase()}</span>
                    <span className={s.sceneDur}>{sc.duration_seconds}s</span>
                  </div>
                  <div className={s.sceneRows}>
                    <div className={s.sceneRow}><span className={s.sceneRowIc}>📹</span><div><div className={s.sceneRowLb}>Visual</div><div className={s.sceneRowTx}>{sc.visual_description}</div></div></div>
                    <div className={s.sceneRow}><span className={s.sceneRowIc}>🎤</span><div><div className={s.sceneRowLb}>Voiceover</div><div className={s.sceneRowTx}>"{sc.narration}"</div></div></div>
                    <div className={s.sceneRow}><span className={s.sceneRowIc}>🔍</span><div><div className={s.sceneRowLb}>Footage</div><div className={s.sceneRowTx}>{sc.pexels_search}</div></div></div>
                  </div>
                </div>
              ))}
              <div className={s.planActions}>
                <button className={s.bigBtn} onClick={goToStep2}>✅ Generate This Video!</button>
                <button className={s.secondBtn} onClick={replan}>🔄 Redo Plan</button>
                <button className={s.ghostBtn} onClick={()=>setStep(0)}>← Edit Brief</button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── STEP 2: GENERATING ── */}
      {step===2 && (
        <div className={s.genWrap}>
          <div className={s.genHead}>
            <div className={s.spinner}/>
            <div className={s.genTitle}>Building your video on our server...</div>
          </div>

          {/* Progress bar */}
          <div className={s.progressWrap}>
            <div className={s.progressBar}>
              <div className={s.progressFill} style={{ width:`${progress}%` }}/>
            </div>
            <div className={s.progressPct}>{progress}%</div>
          </div>

          <div className={s.logBox}>
            {log.map((l,i)=>(
              <div key={i} className={`${s.logLine} ${s[l.t]}`}>{l.m}</div>
            ))}
            <span className={s.cursor}/>
          </div>
          <div className={s.genNote}>
            ⏱️ Usually takes 2–4 minutes. Don't close this tab!
          </div>
        </div>
      )}

      {/* ── STEP 3: DONE ── */}
      {step===3 && done && (
        <div className={s.doneWrap}>
          <div className={s.doneHero}>
            <div className={s.doneEmoji}>🎉</div>
            <div className={s.doneTitle}>Your Video is Ready!</div>
            <div className={s.doneMeta}>{done.scenes} scenes • {brief.duration}s • {brief.voice.name}</div>
          </div>

          {/* Download buttons */}
          <div className={s.downloadRow}>
            <button className={s.downloadBtn} onClick={downloadVideo}>
              ⬇️ Download MP4 Video
            </button>
            <button className={s.downloadBtnSec} onClick={downloadCaption}>
              📋 Download Caption File
            </button>
          </div>

          {[
            { label:'📌 Title',    val: done.title    },
            { label:'📱 Caption',  val: done.caption  },
            { label:'🏷️ Hashtags', val: done.hashtags },
          ].map(item=>(
            <div key={item.label} className={s.doneCard}>
              <div className={s.doneCardLabel}>{item.label}</div>
              <div className={s.doneCardVal}>{item.val}</div>
              <button className={s.copyBtn} onClick={()=>copy(item.val)}>📋 Copy</button>
            </div>
          ))}

          <button className={s.bigBtn} onClick={reset}>🎬 Create Another Video</button>
        </div>
      )}
    </div>
  )
}
