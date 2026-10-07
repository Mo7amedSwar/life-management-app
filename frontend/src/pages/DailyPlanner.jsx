import React, { useState, useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { Clock, CheckCircle2, Circle, ChevronRight, Edit2, Save } from 'lucide-react'

const SCHEDULES = {
  college: {
    name: '📚 جدول الكلية (شتاء)',
    blocks: [
      { time: '٦:٣٠ص', end: '٨:٠٠ص', activity: 'صحيان + مراجعة Anki', icon: '🌅', category: 'health' },
      { time: '٨:٠٠ص', end: '٢:٠٠م', activity: 'الكلية', icon: '🎓', category: 'college' },
      { time: '٢:٠٠م', end: '٣:٠٠م', activity: 'أكل + راحة + صلاة', icon: '🍽️', category: 'rest' },
      { time: '٣:٠٠م', end: '٦:٠٠م', activity: 'دراسة عميقة (٣ ساعات)', icon: '💻', category: 'study' },
      { time: '٦:٠٠م', end: '٧:٠٠م', activity: 'وقت المشروع (١ ساعة)', icon: '🔨', category: 'project' },
      { time: '٧:٠٠م', end: '٨:٠٠م', activity: 'رياضة / تمشية / صلاة', icon: '🏃', category: 'health' },
      { time: '٨:٠٠م', end: '٩:٠٠م', activity: 'Business / Branding (٤٥ دقيقة) + مراجعة اليوم', icon: '💼', category: 'business' },
      { time: '٩:٠٠م', end: '١١:٠٠م', activity: 'وقت حر / كلية / مذاكرة', icon: '🌙', category: 'free' },
    ]
  },
  summer: {
    name: '☀️ جدول الصيف',
    blocks: [
      { time: '٧:٠٠ص', end: '٨:٠٠ص', activity: 'صحيان + Anki + إفطار', icon: '🌅', category: 'health' },
      { time: '٨:٠٠ص', end: '١٢:٠٠م', activity: 'دراسة عميقة (بلوك ١) — ٤ ساعات', icon: '💻', category: 'study' },
      { time: '١٢:٠٠م', end: '٢:٠٠م', activity: 'أكل + راحة + صلاة', icon: '🍽️', category: 'rest' },
      { time: '٢:٠٠م', end: '٥:٠٠م', activity: 'وقت المشاريع (٣ ساعات)', icon: '🔨', category: 'project' },
      { time: '٥:٠٠م', end: '٦:٠٠م', activity: 'رياضة / جيم', icon: '🏋️', category: 'health' },
      { time: '٦:٠٠م', end: '٨:٠٠م', activity: 'AI/ML / Business Study', icon: '🤖', category: 'study' },
      { time: '٨:٠٠م', end: '٩:٠٠م', activity: 'Personal Branding / Content', icon: '💼', category: 'business' },
      { time: '٩:٠٠م', end: '١٠:٠٠م', activity: 'مراجعة اليوم + تخطيط الغد', icon: '📝', category: 'review' },
    ]
  },
  exam: {
    name: '📝 جدول الامتحانات',
    blocks: [
      { time: '٧:٠٠ص', end: '٨:٠٠ص', activity: 'صحيان + إفطار', icon: '🌅', category: 'health' },
      { time: '٨:٠٠ص', end: '١:٠٠م', activity: 'مذاكرة الامتحانات (أولوية)', icon: '📚', category: 'college' },
      { time: '١:٠٠م', end: '٣:٠٠م', activity: 'أكل + راحة + صلاة', icon: '🍽️', category: 'rest' },
      { time: '٣:٠٠م', end: '٥:٠٠م', activity: 'Anki فقط + مراجعة تقنية خفيفة', icon: '🔁', category: 'study' },
      { time: '٥:٠٠م', end: '٧:٠٠م', activity: 'مذاكرة امتحانات (تكملة)', icon: '📚', category: 'college' },
      { time: '٧:٠٠م', end: '٨:٠٠م', activity: 'مشية + راحة + صلاة', icon: '🌿', category: 'health' },
      { time: '٨:٠٠م', end: '١٠:٠٠م', activity: 'مراجعة نهائية للامتحان', icon: '📝', category: 'review' },
    ]
  }
}

const CATEGORY_COLORS = {
  study: 'border-blue-500 bg-blue-500/10',
  project: 'border-indigo-500 bg-indigo-500/10',
  college: 'border-amber-500 bg-amber-500/10',
  business: 'border-purple-500 bg-purple-500/10',
  health: 'border-emerald-500 bg-emerald-500/10',
  rest: 'border-slate-500 bg-slate-500/10',
  review: 'border-rose-500 bg-rose-500/10',
  free: 'border-slate-600 bg-slate-600/10',
}

function getCurrentBlockIndex(blocks) {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()

  const parseArabicTime = (t) => {
    const cleaned = t.replace('ص', ' AM').replace('م', ' PM')
      .replace('٦', '6').replace('٧', '7').replace('٨', '8').replace('٩', '9')
      .replace('١٠', '10').replace('١١', '11').replace('١٢', '12')
      .replace('١', '1').replace('٢', '2').replace('٣', '3')
      .replace('٤', '4').replace('٥', '5').replace(':٠٠', ':00').replace(':٣٠', ':30')
    const d = new Date(`1970/01/01 ${cleaned}`)
    return isNaN(d) ? 0 : d.getHours() * 60 + d.getMinutes()
  }

  const curMin = currentHour * 60 + currentMin
  for (let i = 0; i < blocks.length; i++) {
    const start = parseArabicTime(blocks[i].time)
    const end = parseArabicTime(blocks[i].end)
    if (curMin >= start && curMin < end) return i
  }
  return -1
}

const DailyPlanner = () => {
  const { scheduleMode, setScheduleMode, dailyLog, updateDailyLog } = useAppStore()
  const [blockChecks, setBlockChecks] = useState(() => {
    const saved = localStorage.getItem('block_checks_' + new Date().toDateString())
    return saved ? JSON.parse(saved) : {}
  })
  const [hoursInput, setHoursInput] = useState(dailyLog?.hours_studied || '')
  const [notes, setNotes] = useState({})
  const [editingNote, setEditingNote] = useState(null)

  const schedule = SCHEDULES[scheduleMode]
  const currentBlock = getCurrentBlockIndex(schedule.blocks)

  const toggleBlock = (idx) => {
    const updated = { ...blockChecks, [idx]: !blockChecks[idx] }
    setBlockChecks(updated)
    localStorage.setItem('block_checks_' + new Date().toDateString(), JSON.stringify(updated))
  }

  const completedBlocks = Object.values(blockChecks).filter(Boolean).length
  const totalBlocks = schedule.blocks.length
  const dayProgress = Math.round((completedBlocks / totalBlocks) * 100)

  const saveHours = () => {
    updateDailyLog({ hours_studied: parseFloat(hoursInput) || 0 })
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">📅 المخطط اليومي</h1>
        <div className="text-slate-400 text-sm">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
      </div>

      {/* Schedule Mode Switcher */}
      <div className="flex gap-2 bg-slate-800 p-1 rounded-xl">
        {Object.entries(SCHEDULES).map(([key, val]) => (
          <button key={key} onClick={() => setScheduleMode(key)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${scheduleMode === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}>
            {val.name}
          </button>
        ))}
      </div>

      {/* Day Progress */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-300 font-medium">تقدم اليوم</span>
          <span className="text-2xl font-bold text-white">{dayProgress}٪</span>
        </div>
        <div className="bg-slate-700 rounded-full h-3">
          <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: `${dayProgress}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{completedBlocks} بلوك مكتمل</span>
          <span>{totalBlocks - completedBlocks} متبقي</span>
        </div>
      </div>

      {/* Log Study Hours */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
        <Clock size={20} className="text-blue-400 flex-shrink-0" />
        <span className="text-slate-300 text-sm flex-1">سجّل ساعات الدراسة اليوم:</span>
        <input type="number" min="0" max="12" step="0.5"
          value={hoursInput} onChange={e => setHoursInput(e.target.value)}
          className="w-20 bg-slate-700 text-white text-center rounded-lg px-2 py-1.5 text-sm outline-none border border-slate-600 focus:border-indigo-500"
          placeholder="0" />
        <span className="text-slate-500 text-sm">ساعة</span>
        <button onClick={saveHours} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">حفظ</button>
      </div>

      {/* Schedule Blocks */}
      <div className="space-y-3">
        {schedule.blocks.map((block, idx) => {
          const isNow = idx === currentBlock
          const isDone = blockChecks[idx]
          const noteKey = `${scheduleMode}_${idx}`

          return (
            <div key={idx} className={`rounded-xl border transition-all ${isNow ? 'border-indigo-400 ring-1 ring-indigo-400/30 shadow-lg shadow-indigo-500/10' : isDone ? 'border-slate-700/30 opacity-70' : `border-slate-700/50 ${CATEGORY_COLORS[block.category]}`}`}>
              <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => toggleBlock(idx)}>
                {/* Time */}
                <div className="text-xs text-slate-400 w-16 flex-shrink-0 text-center">
                  <div className="font-medium">{block.time}</div>
                  <div className="text-slate-600">{block.end}</div>
                </div>

                {/* Icon */}
                <div className="text-2xl flex-shrink-0">{block.icon}</div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`font-medium text-sm ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>{block.activity}</div>
                  {isNow && <div className="text-indigo-400 text-xs font-medium mt-0.5">▶ أنت هنا الآن</div>}
                  {notes[noteKey] && <div className="text-slate-400 text-xs mt-1">{notes[noteKey]}</div>}
                </div>

                {/* Checkbox */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <button onClick={e => { e.stopPropagation(); setEditingNote(editingNote === noteKey ? null : noteKey) }}
                    className="text-slate-600 hover:text-slate-400 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  {isDone ? <CheckCircle2 size={22} className="text-emerald-400" /> : <Circle size={22} className="text-slate-500" />}
                </div>
              </div>

              {/* Note input */}
              {editingNote === noteKey && (
                <div className="px-4 pb-4 flex gap-2">
                  <input value={notes[noteKey] || ''} onChange={e => setNotes(n => ({ ...n, [noteKey]: e.target.value }))}
                    placeholder="اكتب ملاحظة..."
                    className="flex-1 bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-600 focus:border-indigo-500"
                    onKeyDown={e => e.key === 'Enter' && setEditingNote(null)} />
                  <button onClick={() => setEditingNote(null)} className="bg-indigo-600 text-white text-xs px-3 rounded-lg">
                    <Save size={14} />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DailyPlanner
