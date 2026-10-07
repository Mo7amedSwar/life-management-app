import React, { useState } from 'react'
import { CheckSquare, Square, Plus, Trash2, Star, RefreshCw, Target } from 'lucide-react'

const today = () => new Date().toISOString().split('T')[0]
const weekNum = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7)
  const week1 = new Date(d.getFullYear(), 0, 4)
  return 1 + Math.round(((d - week1) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7)
}

const DEFAULT_DAILY_HABITS = [
  { id: 'anki',     label: '🔁 Anki (30 دقيقة)',          category: 'Learning', critical: true  },
  { id: 'study',    label: '💻 دراسة عميقة (3 ساعات)',    category: 'Learning', critical: true  },
  { id: 'project',  label: '🔨 وقت المشروع (1 ساعة)',     category: 'Learning', critical: true  },
  { id: 'linkedin', label: '💼 LinkedIn — تفاعل / محتوى', category: 'Brand',    critical: false },
  { id: 'read',     label: '📖 قراءة (15 دقيقة)',         category: 'Growth',   critical: false },
  { id: 'walk',     label: '🚶 مشية أو تمرين',             category: 'Health',   critical: false },
  { id: 'review',   label: '📝 Daily Review (10 دقائق)',   category: 'System',   critical: true  },
  { id: 'water',    label: '💧 8 كوبايا مية',              category: 'Health',   critical: false },
  { id: 'sleep',    label: '😴 نوم قبل 11 م',             category: 'Health',   critical: false },
  { id: 'nozero',   label: '🔥 No Zero Day — عملت حاجة',  category: 'System',   critical: true  },
]

const DEFAULT_WEEKLY_HABITS = [
  { id: 'github',    label: '🐙 Push على GitHub',         category: 'Learning' },
  { id: 'post',      label: '✍️ LinkedIn Post',           category: 'Brand'    },
  { id: 'review',    label: '🔍 Weekly Review جمعة',      category: 'System'   },
  { id: 'plan',      label: '📋 Plan الأسبوع الجاي',      category: 'System'   },
  { id: 'gym3',      label: '🏋️ جيم 3 مرات',            category: 'Health'   },
  { id: 'book',      label: '📚 تقدم في كتاب',            category: 'Growth'   },
]

const CATEGORY_COLORS = {
  Learning: 'text-indigo-400',
  Brand:    'text-purple-400',
  Health:   'text-emerald-400',
  Growth:   'text-amber-400',
  System:   'text-rose-400',
}

const HabitRow = ({ habit, checked, onToggle, critical }) => (
  <div onClick={onToggle}
    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
      ${checked
        ? 'bg-emerald-500/10 border-emerald-600/30 opacity-75'
        : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
      }`}>
    <div className="flex-shrink-0">
      {checked
        ? <CheckSquare size={20} className="text-emerald-400" />
        : <Square size={20} className="text-slate-500" />}
    </div>
    <span className={`flex-1 text-sm ${checked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
      {habit.label}
    </span>
    <div className="flex items-center gap-1.5">
      {critical && !checked && <Star size={12} className="text-amber-400" fill="currentColor" title="أساسي" />}
      <span className={`text-xs ${CATEGORY_COLORS[habit.category] || 'text-slate-500'}`}>{habit.category}</span>
    </div>
  </div>
)

const Habits = () => {
  const [tab, setTab] = useState('daily')
  const [dailyChecks, setDailyChecks] = useState(() =>
    JSON.parse(localStorage.getItem('habits_daily_' + today()) || '{}'))
  const [weeklyChecks, setWeeklyChecks] = useState(() =>
    JSON.parse(localStorage.getItem('habits_weekly_' + weekNum()) || '{}'))
  const [customHabit, setCustomHabit] = useState('')
  const [customHabits, setCustomHabits] = useState(() =>
    JSON.parse(localStorage.getItem('custom_habits') || '[]'))

  const toggleDaily = (id) => {
    const updated = { ...dailyChecks, [id]: !dailyChecks[id] }
    setDailyChecks(updated)
    localStorage.setItem('habits_daily_' + today(), JSON.stringify(updated))
  }

  const toggleWeekly = (id) => {
    const updated = { ...weeklyChecks, [id]: !weeklyChecks[id] }
    setWeeklyChecks(updated)
    localStorage.setItem('habits_weekly_' + weekNum(), JSON.stringify(updated))
  }

  const addCustom = () => {
    if (!customHabit.trim()) return
    const h = { id: Date.now(), label: customHabit, category: 'Custom' }
    const updated = [...customHabits, h]
    setCustomHabits(updated)
    localStorage.setItem('custom_habits', JSON.stringify(updated))
    setCustomHabit('')
  }

  const removeCustom = (id) => {
    const updated = customHabits.filter(h => h.id !== id)
    setCustomHabits(updated)
    localStorage.setItem('custom_habits', JSON.stringify(updated))
  }

  const allDailyHabits  = [...DEFAULT_DAILY_HABITS, ...customHabits]
  const dailyDone       = allDailyHabits.filter(h => dailyChecks[h.id]).length
  const dailyTotal      = allDailyHabits.length
  const dailyPct        = Math.round((dailyDone / dailyTotal) * 100)

  const weeklyDone  = DEFAULT_WEEKLY_HABITS.filter(h => weeklyChecks[h.id]).length
  const weeklyPct   = Math.round((weeklyDone / DEFAULT_WEEKLY_HABITS.length) * 100)

  // Calculate streak from daily habits
  let streak = 0
  for (let i = 0; i < 60; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key  = 'habits_daily_' + d.toISOString().split('T')[0]
    const data = localStorage.getItem(key)
    if (!data) break
    const checks = JSON.parse(data)
    const criticalHabits = DEFAULT_DAILY_HABITS.filter(h => h.critical)
    const allCriticalDone = criticalHabits.every(h => checks[h.id])
    if (allCriticalDone) streak++
    else break
  }

  return (
    <div className="space-y-6 pb-mobile">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">⚡ متابعة العادات</h1>
          <p className="text-slate-400 text-sm mt-1">الانتظام هو السر — يوم بيوم</p>
        </div>
        {streak > 0 && (
          <div className="text-center bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl">
            <div className="text-2xl font-black text-orange-400">🔥 {streak}</div>
            <div className="text-orange-300 text-xs">يوم Streak</div>
          </div>
        )}
      </div>

      {/* Tab Switch */}
      <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
        {[['daily','اليوم'], ['weekly','الأسبوع']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-300">
            {tab === 'daily' ? `اليوم — ${new Date().toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}` : `الأسبوع ${weekNum()}`}
          </span>
          <span className="text-white font-bold">
            {tab === 'daily' ? `${dailyDone}/${dailyTotal}` : `${weeklyDone}/${DEFAULT_WEEKLY_HABITS.length}`}
          </span>
        </div>
        <div className="bg-slate-700 rounded-full h-3">
          <div className={`h-3 rounded-full transition-all duration-500 ${(tab === 'daily' ? dailyPct : weeklyPct) === 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            style={{ width: `${tab === 'daily' ? dailyPct : weeklyPct}%` }} />
        </div>
        {(tab === 'daily' ? dailyPct : weeklyPct) === 100 && (
          <p className="text-emerald-400 text-xs font-medium mt-2 text-center">🎉 أتممت كل العادات — أنت رائع!</p>
        )}
      </div>

      {/* Daily Habits */}
      {tab === 'daily' && (
        <div className="space-y-2">
          {/* Critical first */}
          <p className="text-slate-500 text-xs font-medium px-1">⭐ العادات الأساسية</p>
          {allDailyHabits.filter(h => h.critical).map(h => (
            <HabitRow key={h.id} habit={h} checked={!!dailyChecks[h.id]} onToggle={() => toggleDaily(h.id)} critical />
          ))}
          <p className="text-slate-500 text-xs font-medium px-1 pt-2">📌 عادات إضافية</p>
          {allDailyHabits.filter(h => !h.critical).map(h => (
            <div key={h.id} className="relative">
              <HabitRow habit={h} checked={!!dailyChecks[h.id]} onToggle={() => toggleDaily(h.id)} />
              {h.category === 'Custom' && (
                <button onClick={() => removeCustom(h.id)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}

          {/* Add custom */}
          <div className="flex gap-2 mt-3">
            <input value={customHabit} onChange={e => setCustomHabit(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="+ أضف عادة مخصصة..."
              className="input text-sm" />
            <button onClick={addCustom} className="btn-primary flex-shrink-0 flex items-center gap-1">
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Weekly Habits */}
      {tab === 'weekly' && (
        <div className="space-y-2">
          {DEFAULT_WEEKLY_HABITS.map(h => (
            <HabitRow key={h.id} habit={h} checked={!!weeklyChecks[h.id]} onToggle={() => toggleWeekly(h.id)} />
          ))}
        </div>
      )}

      {/* Past 7 days mini view */}
      <div className="card p-4">
        <h2 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
          <Target size={16} className="text-indigo-400" /> آخر ٧ أيام
        </h2>
        <div className="flex gap-2 justify-between">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date()
            d.setDate(d.getDate() - (6 - i))
            const key  = 'habits_daily_' + d.toISOString().split('T')[0]
            const data = localStorage.getItem(key)
            const checks = data ? JSON.parse(data) : {}
            const done  = DEFAULT_DAILY_HABITS.filter(h => checks[h.id]).length
            const pct   = Math.round((done / DEFAULT_DAILY_HABITS.length) * 100)
            const isToday = d.toISOString().split('T')[0] === today()
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="text-slate-500 text-xs">{d.toLocaleDateString('ar-EG', { weekday: 'short' })}</div>
                <div className={`w-full h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                  ${pct === 0 ? 'bg-slate-800 text-slate-600' :
                    pct < 50  ? 'bg-red-500/20 text-red-400' :
                    pct < 100 ? 'bg-amber-500/20 text-amber-400' :
                                'bg-emerald-500/20 text-emerald-400'}
                  ${isToday ? 'ring-1 ring-indigo-500' : ''}`}>
                  {pct > 0 ? `${pct}٪` : '—'}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Habits
