import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import {
  CheckCircle2, Circle, ChevronRight, Flame,
  BookOpen, Target, Calendar, Zap
} from 'lucide-react'

// ── Phases summary ──────────────────────────────────────────────────
const PHASES = [
  { id: 0, name: 'النظام والعادات',        period: 'أكت–نوف ٢٠٢٦', color: 'purple',  emoji: '🧠' },
  { id: 1, name: 'Linux + Python + Git',   period: 'ديس ٢٠٢٦–فبر ٢٠٢٧', color: 'blue', emoji: '🐧' },
  { id: 2, name: 'Docker + Cloud + K8s',   period: 'مارس–يونيو ٢٠٢٧', color: 'cyan',  emoji: '🐳' },
  { id: 3, name: 'CI/CD + IaC + Monitoring', period: 'يوليو–سبت ٢٠٢٧', color: 'orange', emoji: '⚙️' },
  { id: 4, name: 'AI/ML + MLOps',          period: 'أكت ٢٠٢٧–يناير ٢٠٢٨', color: 'emerald', emoji: '🤖' },
  { id: 5, name: 'Brand + Certs + SaaS',   period: '٢٠٢٨', color: 'rose',   emoji: '🏆' },
]

const DAILY_HABITS = [
  { id: 'anki',    label: '🔁 Anki',          desc: '١٥ دقيقة مراجعة' },
  { id: 'study',   label: '💻 دراسة عميقة',  desc: '٣ ساعات' },
  { id: 'project', label: '🔨 مشروع',          desc: '١ ساعة' },
  { id: 'review',  label: '📝 Daily Review',   desc: '١٠ دقائق' },
]

const QUOTES = [
  'كل خبير كان في البداية مبتدئاً — ابدأ اليوم',
  'اليوم اللي ما بتعلمتش فيه حاجة، يوم ضاع',
  'الانتظام > الموهبة. الشخص المنتظم دايماً يكسب',
  'No Zero Days — حتى ١٠ دقايق أحسن من صفر',
  'الـ Compound Effect — كل يوم صغير يبني سنة كبيرة',
  'مش محتاج تحفز — محتاج نظام',
]

const today = () => new Date().toISOString().split('T')[0]

const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'صباح الخير ☀️'
  if (h < 17) return 'مساء النهار 🌤️'
  if (h < 21) return 'مساء الخير 🌙'
  return 'ليلة طيبة 🌟'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { tasks, streak } = useAppStore()

  // Daily habits
  const [habits, setHabits] = useState(() =>
    JSON.parse(localStorage.getItem('habits_daily_' + today()) || '{}'))

  const toggleHabit = (id) => {
    const updated = { ...habits, [id]: !habits[id] }
    setHabits(updated)
    localStorage.setItem('habits_daily_' + today(), JSON.stringify(updated))
  }

  const habitsDone = DAILY_HABITS.filter(h => habits[h.id]).length
  const allHabitsDone = habitsDone === DAILY_HABITS.length

  // Current phase from tasks
  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length || 147
  const overallPct = Math.round((completedTasks / totalTasks) * 100)

  // Which phase is active
  const currentPhase = PHASES.reduce((active, ph) => {
    const phaseTasks = tasks.filter(t => t.phase === ph.id)
    const phaseDone  = phaseTasks.filter(t => t.completed).length
    if (phaseDone < phaseTasks.length && active.id > ph.id) return ph
    return active
  }, PHASES[5])

  const phaseIndex  = currentPhase?.id ?? 0
  const phaseTasks  = tasks.filter(t => t.phase === phaseIndex)
  const phaseDone   = phaseTasks.filter(t => t.completed).length
  const phasePct    = phaseTasks.length ? Math.round((phaseDone / phaseTasks.length) * 100) : 0

  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  return (
    <div className="space-y-5 pb-mobile max-w-2xl mx-auto">

      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">{getGreeting()}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl">
            <Flame size={18} className="text-orange-400" />
            <span className="text-orange-400 font-black text-xl">{streak}</span>
            <span className="text-orange-300 text-xs">يوم</span>
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-3">
        <p className="text-indigo-300 text-sm text-center font-medium">💬 {quote}</p>
      </div>

      {/* Current Phase — BIG FOCUS */}
      <div
        onClick={() => navigate('/roadmap')}
        className="card p-5 cursor-pointer hover:border-indigo-500/50 transition-all group">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{PHASES[phaseIndex]?.emoji}</span>
            <div>
              <p className="text-slate-400 text-xs">المرحلة الحالية</p>
              <p className="text-white font-bold">{PHASES[phaseIndex]?.name}</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-slate-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${phasePct}%` }} />
          </div>
          <span className="text-white font-bold text-sm w-12 text-left">{phasePct}٪</span>
        </div>
        <p className="text-slate-500 text-xs mt-1.5">{phaseDone} من {phaseTasks.length} موضوع</p>
      </div>

      {/* Daily Habits — THE MOST IMPORTANT SECTION */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Zap size={18} className="text-indigo-400" /> عادات اليوم
          </h2>
          <span className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
            allHabitsDone
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-slate-700 text-slate-400'
          }`}>
            {habitsDone}/{DAILY_HABITS.length}
            {allHabitsDone && ' 🎉'}
          </span>
        </div>
        <div className="space-y-2.5">
          {DAILY_HABITS.map(h => (
            <div key={h.id} onClick={() => toggleHabit(h.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                ${habits[h.id]
                  ? 'bg-emerald-500/10 border-emerald-600/30'
                  : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}>
              {habits[h.id]
                ? <CheckCircle2 size={22} className="text-emerald-400 flex-shrink-0" />
                : <Circle size={22} className="text-slate-600 flex-shrink-0" />
              }
              <div className="flex-1">
                <p className={`text-sm font-medium ${habits[h.id] ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {h.label}
                </p>
                <p className="text-slate-500 text-xs">{h.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Nav — 3 buttons only */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'خريطة الطريق', icon: Target,    path: '/roadmap',  color: 'indigo' },
          { label: 'جدول اليوم',   icon: Calendar,  path: '/planner',  color: 'blue'   },
          { label: 'المصادر',       icon: BookOpen,  path: '/resources', color: 'purple' },
        ].map(({ label, icon: Icon, path, color }) => (
          <button key={path} onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border bg-${color}-500/10 border-${color}-500/20 hover:bg-${color}-500/20 transition-all`}>
            <Icon size={22} className={`text-${color}-400`} />
            <span className={`text-${color}-300 text-xs font-medium text-center`}>{label}</span>
          </button>
        ))}
      </div>

      {/* All Phases — simple overview */}
      <div className="card p-4">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <Target size={16} className="text-slate-400" /> مسيرة السنتين
        </h2>
        <div className="space-y-2">
          {PHASES.map(ph => {
            const pts  = tasks.filter(t => t.phase === ph.id)
            const done = pts.filter(t => t.completed).length
            const pct  = pts.length ? Math.round((done / pts.length) * 100) : 0
            const isActive = ph.id === phaseIndex
            return (
              <div key={ph.id}
                onClick={() => navigate('/roadmap')}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all
                  ${isActive ? 'bg-indigo-500/10 border border-indigo-500/20' : 'hover:bg-slate-800'}`}>
                <span className="text-lg w-7">{ph.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {ph.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all bg-${ph.color}-500`}
                        style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-slate-500 text-xs w-8 text-left">{pct}٪</span>
                  </div>
                </div>
                {isActive && <span className="text-indigo-400 text-xs font-bold flex-shrink-0">الآن</span>}
                {pct === 100 && <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />}
              </div>
            )
          })}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
          <span className="text-slate-400 text-xs">الإجمالي</span>
          <span className="text-white font-bold text-sm">{completedTasks} / {totalTasks} موضوع ✅</span>
        </div>
      </div>

    </div>
  )
}
