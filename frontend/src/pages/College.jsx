import React, { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { Plus, Trash2, BookOpen, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react'
import client from '../api/client'

const EXAMPLE_SUBJECTS = [
  { name: 'هياكل البيانات', professor: '', exam_date: '', credit_hours: 3, hours_studied: 0, completed: false },
]

const College = () => {
  const [subjects, setSubjects] = useState(() => {
    const cached = localStorage.getItem('college_subjects')
    return cached ? JSON.parse(cached) : []
  })
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', professor: '', exam_date: '', credit_hours: 3 })
  const [studyInput, setStudyInput] = useState({})

  const save = (updated) => {
    setSubjects(updated)
    localStorage.setItem('college_subjects', JSON.stringify(updated))
  }

  const addSubject = () => {
    if (!form.name.trim()) return
    save([...subjects, { ...form, id: Date.now(), hours_studied: 0, completed: false }])
    setForm({ name: '', professor: '', exam_date: '', credit_hours: 3 })
    setShowAdd(false)
  }

  const deleteSubject = (id) => save(subjects.filter(s => s.id !== id))

  const toggleComplete = (id) => save(subjects.map(s => s.id === id ? { ...s, completed: !s.completed } : s))

  const addHours = (id, hours) => {
    save(subjects.map(s => s.id === id ? { ...s, hours_studied: (s.hours_studied || 0) + parseFloat(hours || 0) } : s))
    setStudyInput(prev => ({ ...prev, [id]: '' }))
  }

  const upcoming = subjects
    .filter(s => s.exam_date && !s.completed)
    .sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))
    .slice(0, 3)

  const totalHours = subjects.reduce((s, sub) => s + (sub.hours_studied || 0), 0)
  const completed = subjects.filter(s => s.completed).length

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">🎓 مواد الكلية</h1>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">
          <Plus size={16} /> إضافة مادة
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'المواد', value: subjects.length, color: 'text-blue-400' },
          { label: 'ساعات مذاكرة', value: `${totalHours.toFixed(1)}h`, color: 'text-emerald-400' },
          { label: 'مكتملة', value: completed, color: 'text-purple-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Exams */}
      {upcoming.length > 0 && (
        <div className="bg-amber-900/30 border border-amber-700/40 rounded-xl p-4">
          <h2 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
            <Calendar size={16} /> امتحانات قادمة
          </h2>
          <div className="space-y-2">
            {upcoming.map(s => {
              const daysLeft = Math.ceil((new Date(s.exam_date) - new Date()) / 86400000)
              return (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-white text-sm">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs">{new Date(s.exam_date).toLocaleDateString('ar-EG')}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${daysLeft <= 3 ? 'bg-red-500/20 text-red-400' : daysLeft <= 7 ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {daysLeft} يوم
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Add Subject Form */}
      {showAdd && (
        <div className="bg-slate-800 border border-indigo-500/40 rounded-xl p-5">
          <h2 className="text-white font-bold mb-4">إضافة مادة جديدة</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="اسم المادة *"
                className="w-full bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-slate-600 focus:border-indigo-500" />
            </div>
            <input value={form.professor} onChange={e => setForm(f => ({ ...f, professor: e.target.value }))}
              placeholder="اسم الدكتور"
              className="bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-slate-600 focus:border-indigo-500" />
            <input type="date" value={form.exam_date} onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))}
              className="bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-slate-600 focus:border-indigo-500" />
            <input type="number" value={form.credit_hours} onChange={e => setForm(f => ({ ...f, credit_hours: parseInt(e.target.value) }))}
              placeholder="ساعات معتمدة"
              className="bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-slate-600 focus:border-indigo-500" />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={addSubject} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg transition-colors">إضافة</button>
            <button onClick={() => setShowAdd(false)} className="text-slate-400 text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">إلغاء</button>
          </div>
        </div>
      )}

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={48} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">لم تضف أي مواد بعد</p>
          <button onClick={() => setShowAdd(true)} className="text-indigo-400 text-sm mt-2 hover:underline">ابدأ بإضافة مادة</button>
        </div>
      ) : (
        <div className="space-y-3">
          {subjects.map(sub => (
            <div key={sub.id} className={`bg-slate-800/60 border rounded-xl p-4 transition-all ${sub.completed ? 'border-emerald-700/30 opacity-70' : 'border-slate-700/50'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleComplete(sub.id)}>
                    {sub.completed ? <CheckCircle2 size={22} className="text-emerald-400" /> : <Circle size={22} className="text-slate-500" />}
                  </button>
                  <div>
                    <h3 className={`font-bold ${sub.completed ? 'line-through text-slate-500' : 'text-white'}`}>{sub.name}</h3>
                    <div className="flex gap-3 text-xs text-slate-400 mt-0.5">
                      {sub.professor && <span>👨‍🏫 {sub.professor}</span>}
                      {sub.credit_hours && <span>📊 {sub.credit_hours} ساعات</span>}
                      {sub.exam_date && <span>📅 {new Date(sub.exam_date).toLocaleDateString('ar-EG')}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteSubject(sub.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Study Hours Tracker */}
              <div className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-2.5">
                <Clock size={14} className="text-blue-400" />
                <span className="text-slate-400 text-xs">{sub.hours_studied?.toFixed(1) || 0} ساعة مذاكرة</span>
                <div className="flex gap-2 ml-auto">
                  <input type="number" min="0" step="0.5" value={studyInput[sub.id] || ''}
                    onChange={e => setStudyInput(p => ({ ...p, [sub.id]: e.target.value }))}
                    placeholder="+ ساعات"
                    className="w-20 bg-slate-700 text-white text-center rounded px-2 py-1 text-xs outline-none border border-slate-600" />
                  <button onClick={() => addHours(sub.id, studyInput[sub.id])}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded transition-colors">إضافة</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default College
