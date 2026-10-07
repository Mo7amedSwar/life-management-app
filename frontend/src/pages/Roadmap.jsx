import React, { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react'

const PHASES = [
  { id: 0, name: 'Phase 0', title: 'الأساس والانتظام', color: 'indigo', period: 'أكتوبر - نوفمبر ٢٠٢٦', weeks: '٨ أسابيع' },
  { id: 1, name: 'Phase 1', title: 'Linux + Python + Git', color: 'blue', period: 'ديسمبر ٢٠٢٦ - فبراير ٢٠٢٧', weeks: '١٢ أسبوع' },
  { id: 2, name: 'Phase 2', title: 'Cloud + Containers + Kubernetes', color: 'cyan', period: 'مارس - يونيو ٢٠٢٧', weeks: '١٦ أسبوع', milestone: '🎯 Job-Ready بعد هذه المرحلة!' },
  { id: 3, name: 'Phase 3', title: 'AI/ML + MLOps', color: 'emerald', period: 'يوليو - أكتوبر ٢٠٢٧', weeks: '١٦ أسبوع' },
  { id: 4, name: 'Phase 4', title: 'CI/CD + IaC + Observability', color: 'orange', period: 'نوفمبر ٢٠٢٧ - مارس ٢٠٢٨', weeks: '٢٠ أسبوع' },
  { id: 5, name: 'Phase 5', title: 'Integration + Brand + Leadership', color: 'rose', period: 'أبريل - أكتوبر ٢٠٢٨', weeks: '٢٦ أسبوع', milestone: '👑 Senior AI Platform Engineer' },
]

const CATEGORY_COLORS = {
  'DevOps': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'AI/ML': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Business': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'College': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
}

const PHASE_BORDER_COLORS = {
  indigo: 'border-indigo-500', blue: 'border-blue-500', cyan: 'border-cyan-500',
  emerald: 'border-emerald-500', orange: 'border-orange-500', rose: 'border-rose-500',
}
const PHASE_BG_COLORS = {
  indigo: 'from-indigo-900/60 to-slate-900', blue: 'from-blue-900/60 to-slate-900',
  cyan: 'from-cyan-900/60 to-slate-900', emerald: 'from-emerald-900/60 to-slate-900',
  orange: 'from-orange-900/60 to-slate-900', rose: 'from-rose-900/60 to-slate-900',
}
const PHASE_ACCENT_COLORS = {
  indigo: 'bg-indigo-500', blue: 'bg-blue-500', cyan: 'bg-cyan-500',
  emerald: 'bg-emerald-500', orange: 'bg-orange-500', rose: 'bg-rose-500',
}
const PHASE_TEXT_COLORS = {
  indigo: 'text-indigo-400', blue: 'text-blue-400', cyan: 'text-cyan-400',
  emerald: 'text-emerald-400', orange: 'text-orange-400', rose: 'text-rose-400',
}

const Roadmap = () => {
  const { tasks, toggleTask, addCustomTask, deleteCustomTask } = useAppStore()
  const [expanded, setExpanded] = useState({ 0: true })
  const [showAddTask, setShowAddTask] = useState(null)
  const [newTask, setNewTask] = useState({ title: '', category: 'DevOps' })
  const [filter, setFilter] = useState('all')

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  const handleAddTask = async (phaseId) => {
    if (!newTask.title.trim()) return
    await addCustomTask({ ...newTask, phase: phaseId })
    setNewTask({ title: '', category: 'DevOps' })
    setShowAddTask(null)
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🗺️ خريطة الطريق</h1>
        <div className="flex gap-2">
          {['all', 'DevOps', 'AI/ML', 'Business'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
              {f === 'all' ? 'الكل' : f}
            </button>
          ))}
        </div>
      </div>

      {PHASES.map(phase => {
        const phaseTasks = tasks.filter(t => t.phase === phase.id && (filter === 'all' || t.category === filter))
        const done = phaseTasks.filter(t => t.completed).length
        const pct = phaseTasks.length ? Math.round((done / phaseTasks.length) * 100) : 0
        const isOpen = expanded[phase.id]

        return (
          <div key={phase.id} className={`border ${PHASE_BORDER_COLORS[phase.color]} rounded-xl overflow-hidden`}>
            {/* Phase Header */}
            <button onClick={() => toggle(phase.id)}
              className={`w-full bg-gradient-to-r ${PHASE_BG_COLORS[phase.color]} p-5 flex items-center gap-4 hover:brightness-110 transition-all`}>
              <div className={`w-10 h-10 rounded-full ${PHASE_ACCENT_COLORS[phase.color]} flex items-center justify-center text-white font-bold flex-shrink-0`}>
                {phase.id}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-1">
                  <span className={`font-bold text-white text-base`}>{phase.name}: {phase.title}</span>
                  {phase.milestone && <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 rounded-full">{phase.milestone}</span>}
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span>📅 {phase.period}</span>
                  <span>⏱ {phase.weeks}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-slate-700 rounded-full h-1.5">
                    <div className={`${PHASE_ACCENT_COLORS[phase.color]} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-sm font-bold ${PHASE_TEXT_COLORS[phase.color]}`}>{pct}٪</span>
                  <span className="text-slate-400 text-xs">{done}/{phaseTasks.length}</span>
                </div>
              </div>
              <div className="text-slate-400 flex-shrink-0">{isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
            </button>

            {/* Task List */}
            {isOpen && (
              <div className="bg-slate-900/50 p-4 space-y-2">
                {phaseTasks.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">لا توجد مهام في هذه الفلتر</p>
                )}
                {phaseTasks.map(task => (
                  <div key={task.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:bg-slate-700/50 ${task.completed ? 'bg-slate-800/30 border-slate-700/30 opacity-70' : 'bg-slate-800/50 border-slate-700/50'}`}
                    onClick={() => toggleTask(task.id, !task.completed)}>
                    <div className="flex-shrink-0">
                      {task.completed
                        ? <CheckCircle2 size={20} className="text-emerald-400" />
                        : <Circle size={20} className="text-slate-500" />}
                    </div>
                    <span className={`flex-1 text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[task.category] || 'bg-slate-500/20 text-slate-300'}`}>
                      {task.category}
                    </span>
                    {task.custom && (
                      <button onClick={e => { e.stopPropagation(); deleteCustomTask(task.id) }}
                        className="text-slate-600 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Task */}
                {showAddTask === phase.id ? (
                  <div className="flex gap-2 mt-2 p-3 bg-slate-800 rounded-lg border border-slate-600">
                    <input value={newTask.title} onChange={e => setNewTask(n => ({ ...n, title: e.target.value }))}
                      placeholder="اسم المهمة..."
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder-slate-500"
                      onKeyDown={e => e.key === 'Enter' && handleAddTask(phase.id)}
                      autoFocus />
                    <select value={newTask.category} onChange={e => setNewTask(n => ({ ...n, category: e.target.value }))}
                      className="bg-slate-700 text-white text-xs rounded px-2 outline-none">
                      <option>DevOps</option><option>AI/ML</option><option>Business</option><option>College</option>
                    </select>
                    <button onClick={() => handleAddTask(phase.id)} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold px-2">إضافة</button>
                    <button onClick={() => setShowAddTask(null)} className="text-slate-500 hover:text-slate-300 text-xs">إلغاء</button>
                  </div>
                ) : (
                  <button onClick={() => setShowAddTask(phase.id)}
                    className="w-full flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors text-sm py-2">
                    <Plus size={16} /> إضافة مهمة مخصصة
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Roadmap
