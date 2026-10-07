import React, { useState, useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { TrendingUp, Calendar, Target, Flame, Clock, CheckCircle } from 'lucide-react'

const COLORS = ['#6366f1', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

const Analytics = () => {
  const { tasks, streak } = useAppStore()
  const [period, setPeriod] = useState('week')

  // Build weekly study data from localStorage
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = 'daily_log_' + d.toISOString().split('T')[0]
    const log = localStorage.getItem(key)
    const parsed = log ? JSON.parse(log) : {}
    return {
      day: d.toLocaleDateString('ar-EG', { weekday: 'short' }),
      hours: parsed.hours_studied || 0,
      tasks: parsed.tasks_completed || 0,
      mood: parsed.mood || 0,
    }
  })

  // Category breakdown
  const categoryData = ['DevOps', 'AI/ML', 'Business', 'College'].map(cat => ({
    name: cat,
    total: tasks.filter(t => t.category === cat).length,
    done: tasks.filter(t => t.category === cat && t.completed).length,
    pct: tasks.filter(t => t.category === cat).length
      ? Math.round((tasks.filter(t => t.category === cat && t.completed).length / tasks.filter(t => t.category === cat).length) * 100)
      : 0
  }))

  // Phase progress data
  const phaseData = Array.from({ length: 6 }, (_, i) => {
    const pts = tasks.filter(t => t.phase === i)
    const done = pts.filter(t => t.completed).length
    return {
      name: `Phase ${i}`,
      total: pts.length,
      done,
      pct: pts.length ? Math.round((done / pts.length) * 100) : 0
    }
  })

  const totalHours = weekData.reduce((s, d) => s + d.hours, 0)
  const avgMood = weekData.filter(d => d.mood > 0).reduce((s, d, _, a) => s + d.mood / a.length, 0).toFixed(1)
  const totalTasksDone = tasks.filter(t => t.completed).length

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold text-white">📊 التحليلات والتقدم</h1>

      {/* Period Selector */}
      <div className="flex gap-2 bg-slate-800 p-1 rounded-xl w-fit">
        {['week', 'phase', 'overall'].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {p === 'week' ? 'الأسبوع' : p === 'phase' ? 'المراحل' : 'الإجمالي'}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ساعات الأسبوع', value: `${totalHours.toFixed(1)}h`, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Streak الحالي', value: `${streak} يوم`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'مهام مكتملة', value: totalTasksDone, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'متوسط المزاج', value: avgMood > 0 ? `${avgMood}/5` : 'N/A', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bg}`}><Icon size={20} className={color} /></div>
            <div><p className="text-slate-400 text-xs">{label}</p><p className="text-xl font-bold text-white">{value}</p></div>
          </div>
        ))}
      </div>

      {period === 'week' && (
        <>
          {/* Study Hours Chart */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-white font-bold mb-4">⏱ ساعات الدراسة — آخر ٧ أيام</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} name="ساعات" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Chart */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-white font-bold mb-4">😊 مستوى المزاج — آخر ٧ أيام</h2>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 5]} stroke="#94a3b8" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="المزاج" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {period === 'phase' && (
        <>
          {/* Phase Progress Bars */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-white font-bold mb-4">🗺️ تقدم كل مرحلة</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={phaseData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 12 }} tickFormatter={v => `${v}٪`} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 12 }} width={60} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={v => [`${v}٪`, 'التقدم']} />
                <Bar dataKey="pct" radius={[0, 4, 4, 0]} name="التقدم ٪">
                  {phaseData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {period === 'overall' && (
        <>
          {/* Category Breakdown */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4">📂 توزيع المهام بالتصنيف</h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, pct }) => `${name} ${pct}٪`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-white font-bold mb-4">✅ إنجاز كل تصنيف</h2>
              <div className="space-y-4">
                {categoryData.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300">{cat.name}</span>
                      <span className="text-slate-400">{cat.done}/{cat.total}</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${cat.pct}%`, backgroundColor: COLORS[i] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900 border border-indigo-700/30 rounded-xl p-6 text-center">
            <div className="text-6xl font-black text-white mb-2">
              {tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}
              <span className="text-3xl text-indigo-400">٪</span>
            </div>
            <p className="text-slate-400">من خطة السنتين مكتملة</p>
            <div className="mt-4 bg-slate-700/50 rounded-full h-3">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%` }} />
            </div>
            <p className="text-slate-500 text-sm mt-3">
              {tasks.filter(t => t.completed).length} مهمة من أصل {tasks.length} — تبقى {tasks.length - tasks.filter(t => t.completed).length}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics
