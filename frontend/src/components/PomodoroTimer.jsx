import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Play, Pause, RotateCcw, Settings2, Coffee, Brain, X } from 'lucide-react'

const MODES = {
  focus:       { label: 'تركيز',     duration: 25 * 60, color: 'from-indigo-600 to-purple-600',   icon: Brain  },
  short_break: { label: 'استراحة',   duration:  5 * 60, color: 'from-emerald-600 to-teal-600',    icon: Coffee },
  long_break:  { label: 'استراحة كبيرة', duration: 15 * 60, color: 'from-blue-600 to-cyan-600',  icon: Coffee },
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// Floating Pomodoro Timer — shown on all pages
const PomodoroTimer = () => {
  const [mode, setMode]         = useState('focus')
  const [seconds, setSeconds]   = useState(MODES.focus.duration)
  const [running, setRunning]   = useState(false)
  const [sessions, setSessions] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible]   = useState(true)
  const [customMin, setCustomMin] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)
  const cfg = MODES[mode]

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setSeconds(MODES[mode].duration)
  }, [mode])

  useEffect(() => { reset() }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            // Auto-switch & notify
            if (mode === 'focus') {
              const next = sessions + 1
              setSessions(next)
              setMode(next % 4 === 0 ? 'long_break' : 'short_break')
              new Notification?.('⏰ وقت الاستراحة!', { body: 'خلصت جلسة التركيز — خد استراحة' })
            } else {
              setMode('focus')
              new Notification?.('🧠 يلا نكمل!', { body: 'خلصت الاستراحة — رجّع التركيز' })
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode, sessions])

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Update page title with timer
  useEffect(() => {
    if (running) document.title = `${fmt(seconds)} — ${cfg.label} | Time Manager`
    else document.title = 'Time Manager'
    return () => { document.title = 'Time Manager' }
  }, [running, seconds, cfg.label])

  const pct = ((MODES[mode].duration - seconds) / MODES[mode].duration) * 100
  const r = 40
  const circ = 2 * Math.PI * r

  if (!visible) return (
    <button onClick={() => setVisible(true)}
      className="fixed bottom-24 left-4 z-50 md:bottom-6 w-10 h-10 rounded-full bg-indigo-600 shadow-lg flex items-center justify-center text-white text-xs font-bold hover:bg-indigo-500 transition-all">
      🍅
    </button>
  )

  return (
    <div className={`fixed z-50 transition-all duration-300 shadow-2xl
      ${expanded
        ? 'bottom-24 left-2 right-2 md:bottom-6 md:left-auto md:right-6 md:w-72 rounded-2xl'
        : 'bottom-24 left-4 md:bottom-6 md:left-auto md:right-6 w-auto rounded-2xl'
      } bg-slate-900 border border-slate-700`}>

      {/* Collapsed view */}
      {!expanded ? (
        <button onClick={() => setExpanded(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl bg-gradient-to-r ${cfg.color} text-white`}>
          <span className="text-sm font-mono font-bold">{fmt(seconds)}</span>
          <span className="text-xs opacity-80">{cfg.label}</span>
          {running && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
        </button>
      ) : (
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-white font-bold text-sm flex items-center gap-1.5">
              🍅 بومودورو
              {sessions > 0 && <span className="text-xs text-indigo-400">({sessions} جلسة)</span>}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setShowSettings(s => !s)} className="text-slate-400 hover:text-white p-1 rounded transition-colors">
                <Settings2 size={14} />
              </button>
              <button onClick={() => setExpanded(false)} className="text-slate-400 hover:text-white p-1 rounded transition-colors">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Mode Selector */}
          <div className="flex gap-1 mb-4 bg-slate-800 p-1 rounded-xl">
            {Object.entries(MODES).map(([key, m]) => (
              <button key={key} onClick={() => setMode(key)}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${mode === key ? `bg-gradient-to-r ${m.color} text-white` : 'text-slate-400 hover:text-white'}`}>
                {m.label}
              </button>
            ))}
          </div>

          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <svg width="120" height="120" className="rotate-[-90deg]">
                <circle cx="60" cy="60" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle cx="60" cy="60" r={r} fill="none"
                  stroke="url(#timerGrad)" strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={circ - (pct / 100) * circ}
                  strokeLinecap="round"
                  className="transition-all duration-1000" />
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-mono font-bold text-2xl">{fmt(seconds)}</span>
                <span className="text-slate-400 text-xs">{cfg.label}</span>
              </div>
            </div>
          </div>

          {/* Custom duration */}
          {showSettings && (
            <div className="mb-3 flex gap-2">
              <input type="number" value={customMin} onChange={e => setCustomMin(e.target.value)}
                placeholder="دقائق مخصصة"
                className="flex-1 bg-slate-700 text-white text-xs rounded-lg px-2 py-1.5 outline-none border border-slate-600" />
              <button onClick={() => {
                if (customMin > 0) {
                  setRunning(false)
                  setSeconds(parseInt(customMin) * 60)
                  setShowSettings(false)
                }
              }} className="bg-indigo-600 text-white text-xs px-2 rounded-lg">تطبيق</button>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2">
            <button onClick={() => setRunning(r => !r)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all bg-gradient-to-r ${cfg.color} text-white hover:opacity-90`}>
              {running ? <><Pause size={16} /> إيقاف</> : <><Play size={16} /> {seconds === MODES[mode].duration ? 'ابدأ' : 'متابعة'}</>}
            </button>
            <button onClick={reset}
              className="p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all">
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Sessions dots */}
          {sessions > 0 && (
            <div className="flex gap-1.5 justify-center mt-3">
              {Array.from({ length: Math.min(sessions, 8) }, (_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i < sessions ? 'bg-indigo-500' : 'bg-slate-700'}`} />
              ))}
              {sessions > 8 && <span className="text-slate-500 text-xs">+{sessions - 8}</span>}
            </div>
          )}

          <button onClick={() => setVisible(false)}
            className="w-full text-center text-slate-600 text-xs mt-2 hover:text-slate-400 transition-colors">
            إخفاء
          </button>
        </div>
      )}
    </div>
  )
}

export default PomodoroTimer
