import React, { useState } from 'react'
import useAppStore from '../store/useAppStore'
import { Settings as SettingsIcon, Sun, Moon, Key, Download, Upload, RotateCcw, Shield } from 'lucide-react'

const Settings = () => {
  const { scheduleMode, setScheduleMode, geminiApiKey, setGeminiApiKey, tasks } = useAppStore()
  const [apiKey, setApiKey] = useState(geminiApiKey)
  const [saved, setSaved] = useState('')
  const [showReset, setShowReset] = useState(false)

  const saveApiKey = () => {
    setGeminiApiKey(apiKey)
    setSaved('api')
    setTimeout(() => setSaved(''), 2000)
  }

  const exportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      tasks: JSON.parse(localStorage.getItem('tasks_cache') || '[]'),
      collegeSubjects: JSON.parse(localStorage.getItem('college_subjects') || '[]'),
      scheduleMode: localStorage.getItem('scheduleMode'),
      chatHistory: JSON.parse(localStorage.getItem('chatHistory') || '[]'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `timemanager_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.tasks) localStorage.setItem('tasks_cache', JSON.stringify(data.tasks))
        if (data.collegeSubjects) localStorage.setItem('college_subjects', JSON.stringify(data.collegeSubjects))
        if (data.chatHistory) localStorage.setItem('chatHistory', JSON.stringify(data.chatHistory))
        setSaved('import')
        setTimeout(() => setSaved(''), 2000)
      } catch { alert('ملف غير صالح') }
    }
    reader.readAsText(file)
  }

  const resetProgress = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith('daily_log_') || k.startsWith('health_') || k === 'block_checks_')
    keys.forEach(k => localStorage.removeItem(k))
    // Reset task completions
    const tasks = JSON.parse(localStorage.getItem('tasks_cache') || '[]')
    const reset = tasks.map(t => ({ ...t, completed: false }))
    localStorage.setItem('tasks_cache', JSON.stringify(reset))
    setShowReset(false)
    window.location.reload()
  }

  const totalCompleted = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <SettingsIcon size={24} /> الإعدادات
      </h1>

      {/* Schedule Mode */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Sun size={18} className="text-amber-400" /> وضع الجدول الزمني
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'college', label: '📚 الكلية (شتاء)', desc: 'من ٦:٣٠ص — ٨ ساعات كلية' },
            { key: 'summer', label: '☀️ الصيف', desc: 'من ٧ص — ٧ ساعات دراسة' },
            { key: 'exam', label: '📝 الامتحانات', desc: 'أولوية الكلية أولاً' },
          ].map(({ key, label, desc }) => (
            <button key={key} onClick={() => setScheduleMode(key)}
              className={`p-4 rounded-xl text-left border transition-all ${scheduleMode === key ? 'border-indigo-500 bg-indigo-900/40 text-white' : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'}`}>
              <div className="font-medium text-sm mb-1">{label}</div>
              <div className="text-xs opacity-60">{desc}</div>
            </button>
          ))}
        </div>
        {saved === 'schedule' && <p className="text-emerald-400 text-xs mt-2">✅ تم الحفظ</p>}
      </div>

      {/* AI API Key */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-white font-bold mb-1 flex items-center gap-2">
          <Key size={18} className="text-amber-400" /> Gemini AI Key
        </h2>
        <p className="text-slate-400 text-xs mb-4">
          احصل على مفتاح مجاني من{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" className="text-indigo-400 underline">
            Google AI Studio
          </a>
          {' '}لتفعيل المساعد الذكي
        </p>
        <div className="flex gap-2">
          <input value={apiKey} onChange={e => setApiKey(e.target.value)}
            type="password" placeholder="AIza..."
            className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-slate-600 focus:border-indigo-500" />
          <button onClick={saveApiKey}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${saved === 'api' ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            {saved === 'api' ? '✅ تم' : 'حفظ'}
          </button>
        </div>
        {geminiApiKey && <p className="text-emerald-400 text-xs mt-2">✅ الـ API Key محفوظ ومفعّل</p>}
      </div>

      {/* Progress Stats */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-white font-bold mb-4">📊 إحصائيات التقدم</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-3xl font-black text-indigo-400">{totalCompleted}</div>
            <div className="text-slate-400 text-sm">مهمة مكتملة</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-slate-400">{totalTasks - totalCompleted}</div>
            <div className="text-slate-400 text-sm">مهمة متبقية</div>
          </div>
        </div>
        <div className="mt-4 bg-slate-700 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            style={{ width: `${totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0}%` }} />
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Shield size={18} className="text-emerald-400" /> إدارة البيانات
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={exportData}
            className="flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-600/40 text-emerald-400 py-3 rounded-xl text-sm font-medium transition-all">
            <Download size={16} /> تصدير البيانات
          </button>
          <label className="flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/40 text-blue-400 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer">
            <Upload size={16} /> استيراد بيانات
            <input type="file" accept=".json" onChange={importData} className="hidden" />
          </label>
        </div>
        {saved === 'import' && <p className="text-emerald-400 text-xs mt-2">✅ تم الاستيراد بنجاح — أعد تحميل الصفحة</p>}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-900/20 border border-red-800/40 rounded-xl p-5">
        <h2 className="text-red-400 font-bold mb-3 flex items-center gap-2">
          <RotateCcw size={18} /> منطقة الخطر
        </h2>
        {!showReset ? (
          <button onClick={() => setShowReset(true)}
            className="bg-red-600/20 hover:bg-red-600/30 border border-red-600/40 text-red-400 py-2.5 px-4 rounded-lg text-sm font-medium transition-all">
            إعادة تعيين التقدم
          </button>
        ) : (
          <div>
            <p className="text-slate-300 text-sm mb-3">⚠️ هيتم مسح كل التقدم اليومي والصحة. مش هيتعمل Undo!</p>
            <div className="flex gap-2">
              <button onClick={resetProgress} className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-lg text-sm transition-colors">نعم، امسح كل حاجة</button>
              <button onClick={() => setShowReset(false)} className="bg-slate-700 text-slate-300 py-2 px-4 rounded-lg text-sm transition-colors">إلغاء</button>
            </div>
          </div>
        )}
      </div>

      {/* App Info */}
      <div className="text-center text-slate-600 text-xs space-y-1 pb-4">
        <p>🗺️ خطة السنتين — AI Platform Engineer Track</p>
        <p>Built with React + FastAPI + Gemini AI</p>
        <p>Version 1.0.0 — أكتوبر ٢٠٢٦</p>
      </div>
    </div>
  )
}

export default Settings
