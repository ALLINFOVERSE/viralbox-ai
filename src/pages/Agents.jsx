// ── AGENTS PAGE ──────────────────────────────────────────────
import { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import s from './Agents.module.css'

const AGENTS = [
  { id:'ceo',    e:'👔', name:'CEO Agent',       color:'purple', role:'Plans strategy, assigns tasks to all agents',           tasks:['Master planning','Task delegation','Quality control'] },
  { id:'dir',    e:'🎬', name:'Director Agent',  color:'red',    role:'Plans cinematic scenes and visual composition',         tasks:['Scene planning','Visual direction','Mood setting'] },
  { id:'script', e:'✍️', name:'Script Writer',   color:'cyan',   role:'Writes narration, scripts and voiceover copy',         tasks:['Cinematic scripts','Viral hooks','CTA writing'] },
  { id:'voice',  e:'🎙️', name:'Voice Agent',     color:'orange', role:'Selects voice style and optimizes audio delivery',     tasks:['Voice selection','Tone control','Audio pacing'] },
  { id:'clip',   e:'📹', name:'Footage Agent',   color:'green',  role:'Searches and downloads perfect stock footage',         tasks:['Pexels search','Clip selection','Quality check'] },
  { id:'edit',   e:'✂️', name:'Editor Agent',    color:'yellow', role:'Edits, combines, and polishes the final video',        tasks:['Scene combining','Fade effects','Final export'] },
  { id:'caption',e:'📝', name:'Caption Agent',   color:'blue',   role:'Writes viral captions and hashtags',                   tasks:['IG captions','YT descriptions','Hashtag research'] },
  { id:'email',  e:'📧', name:'Email Agent',     color:'pink',   role:'Handles brand outreach and collaboration emails',      tasks:['Brand pitches','Collab emails','Reply templates'] },
]

export function Agents() {
  const { config } = useApp()
  const [active, setActive] = useState(null)
  const [chat,   setChat]   = useState({})
  const [input,  setInput]  = useState('')
  const [loading,setLoading]= useState(false)

  const open = (a) => { setActive(a); if (!chat[a.id]) setChat(p=>({...p,[a.id]:[]})) }

  const send = async () => {
    if (!input.trim() || !active || loading) return
    if (!config.groqKey) { alert('Service unavailable — try again later.'); return }
    const msg = input.trim(); setInput('')
    setChat(p=>({...p,[active.id]:[...(p[active.id]||[]),{r:'user',t:msg}]}))
    setLoading(true)
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions',{
        method:'POST',
        headers:{'Authorization':`Bearer ${config.groqKey}`,'Content-Type':'application/json'},
        body:JSON.stringify({
          model:'llama-3.3-70b-versatile', max_tokens:400,
          messages:[
            {role:'system',content:`You are the ${active.name} of ViralBox.ai, an AI video creation platform. Role: ${active.role}. Be helpful and concise. Max 120 words.`},
            {role:'user',content:msg}
          ]
        })
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error?.message||'Error')
      const reply = d.choices[0].message.content
      setChat(p=>({...p,[active.id]:[...p[active.id],{r:'agent',t:reply}]}))
    } catch(e) {
      setChat(p=>({...p,[active.id]:[...p[active.id],{r:'err',t:`Error: ${e.message}`}]}))
    } finally { setLoading(false) }
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.tag}>YOUR TEAM</div>
        <h1 className={s.title}>AI Agents</h1>
        <p className={s.sub}>8 specialist agents — tap any to chat directly</p>
      </div>
      <div className={s.layout}>
        <div className={s.grid}>
          {AGENTS.map(a=>(
            <div key={a.id} className={`${s.card} ${s[a.color]} ${active?.id===a.id?s.cardActive:''}`} onClick={()=>open(a)}>
              <div className={s.emoji}>{a.e}</div>
              <div className={s.name}>{a.name}</div>
              <div className={s.role}>{a.role}</div>
              <div className={s.tasks}>{a.tasks.map(t=><span key={t}>✓ {t}</span>)}</div>
            </div>
          ))}
        </div>
        {active && (
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelEmoji}>{active.e}</span>
              <div><div className={s.panelName}>{active.name}</div><div className={s.panelRole}>{active.role}</div></div>
              <button className={s.closeBtn} onClick={()=>setActive(null)}>✕</button>
            </div>
            <div className={s.msgs}>
              {!(chat[active.id]||[]).length && (
                <div className={s.empty}><div className={s.emptyE}>{active.e}</div><div>Hi! I'm {active.name}. Ask me anything!</div></div>
              )}
              {(chat[active.id]||[]).map((m,i)=>(
                <div key={i} className={`${s.msg} ${s[m.r]}`}><div className={s.msgTxt}>{m.t}</div></div>
              ))}
              {loading && <div className={`${s.msg} ${s.agent}`}><div className={s.typing}><span/><span/><span/></div></div>}
            </div>
            <div className={s.panelInput}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder={`Ask ${active.name}...`} />
              <button className={s.sendBtn} onClick={send} disabled={loading}>{loading?'...':'→'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Agents
