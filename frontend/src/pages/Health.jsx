import React, { useState, useEffect } from 'react'
import useAppStore from '../store/useAppStore'
import { Heart, Moon, Droplets, Zap, Dumbbell, Save } from 'lucide-react'

const MOODS = ['😔', '😐', '🙂', '😊', '🤩']
const ENERGY = ['⚡', '⚡⚡', '⚡⚡⚡', '⚡⚡⚡⚡', '⚡⚡⚡⚡⚡']

const today = () => new Date().toISOString().split('T')[0]

const Health = () => {
  const { updateDailyLog, dailyLog } = useAppStore()

  const [form, setForm] = useState(() => {
    const cached = localStorage.getItem('health_' + today())
    return cached ? JSON.parse(cached) : {
      mood: 3, energy: 3, sleep_hours: 7, water_intake: 8, gym_notes: '', gym_done: false
    }
  })
  const [saved, setSaved] = useState(false)

  const save = () => {
    localStorage.setItem('health_' + today(), JSON.stringify(form))
    updateDailyLog({ mood: form.mood, energy: form.energy, sleep_hours: form.sleep_hours, water_intake: form.water_intake })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const weekHealthData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = 'health_' + d.toISOString().split('T')[0]
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  })

  const avgMood = weekHealthData.filter(Boolean).reduce((s, d, _, a) => s + d.mood / a.length, 0).toFixed(1)
  const avgSleep = weekHealthData.filter(Boolean).reduce((s, d, _, a) => s + d.sleep_hours / a.length, 0).toFixed(1)
  const gymDays = weekHealthData.filter(d => d?.gym_done).length

  return (
    <div className="space-y-6 pb-8">
      <h1 className="text-2xl font-bold text-white">💪 الصحة والعافية</h1>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'متوسط المزاج', value: `${avgMood}/5`, icon: '😊', color: 'text-emerald-400' },
          { label: 'متوسط النوم', value: `${avgSleep}h`, icon: '😴', color: 'text-blue-400' },
          { label: 'أيام الجيم', value: `${gymDays}/7`, icon: '🏋️', color: 'text-purple-400' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-slate-400 text-xs mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Daily Check-in */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 space-y-5">
        <h2 className="text-white font-bold flex items-center gap-2">
          <Heart size={18} className="text-rose-400" /> تسجيل اليوم
          <span className="text-slate-500 text-sm font-normal">({new Date().toLocaleDateString('ar-EG', { weekday: 'long', month: 'long', day: 'numeric' })})</span>
        </h2>

        {/* Mood */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-3 block">المزاج</label>
          <div className="flex gap-3">
            {MOODS.map((emoji, i) => (
              <button key={i} onClick={() => setForm(f => ({ ...f, mood: i + 1 }))}
                className={`text-3xl transition-all ${form.mood === i + 1 ? 'scale-125 opacity-100' : 'scale-100 opacity-40 hover:opacity-70'}`}>
                {emoji}
              </button>
            ))}
          </div>
          <p className="text-slate-500 text-xs mt-2">
            {['متعب جداً', 'مش تمام', 'عادي', 'كويس', 'ممتاز'][form.mood - 1]}
          </p>
        </div>

        {/* Energy */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-3 block">مستوى الطاقة</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setForm(f => ({ ...f, energy: n }))}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${form.energy >= n ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-500'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
            <Moon size={14} className="text-blue-400" /> ساعات النوم
          </label>
          <div className="flex items-center gap-4">
            <input type="range" min="3" max="12" step="0.5" value={form.sleep_hours}
              onChange={e => setForm(f => ({ ...f, sleep_hours: parseFloat(e.target.value) }))}
              className="flex-1 accent-blue-500" />
            <span className="text-white font-bold text-lg w-12 text-center">{form.sleep_hours}h</span>
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {form.sleep_hours < 6 ? '⚠️ نوم أقل من الكافي' : form.sleep_hours >= 7 && form.sleep_hours <= 9 ? '✅ ممتاز' : 'مقبول'}
          </div>
        </div>

        {/* Water */}
        <div>
          <label className="text-slate-300 text-sm font-medium mb-2 flex items-center gap-2">
            <Droplets size={14} className="text-cyan-400" /> كوبايا مية ({form.water_intake} كوباية)
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, i) => (
              <button key={i} onClick={() => setForm(f => ({ ...f, water_intake: i + 1 }))}
                className={`text-xl transition-all ${i < form.water_intake ? 'opacity-100' : 'opacity-20'}`}>
                💧
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {form.water_intake < 6 ? '⚠️ اشرب أكتر' : form.water_intake >= 8 ? '✅ ممتاز' : 'كويس'}
          </div>
        </div>

        {/* Gym */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <label className="text-slate-300 text-sm font-medium flex items-center gap-2">
              <Dumbbell size={14} className="text-purple-400" /> الجيم
            </label>
            <button onClick={() => setForm(f => ({ ...f, gym_done: !f.gym_done }))}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${form.gym_done ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
              {form.gym_done ? '✅ عملت جيم' : 'ما رحتش'}
            </button>
          </div>
          {form.gym_done && (
            <textarea value={form.gym_notes} onChange={e => setForm(f => ({ ...f, gym_notes: e.target.value }))}
              placeholder="التمرين اللي عملته..."
              rows={2}
              className="w-full bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none border border-slate-600 focus:border-indigo-500 resize-none" />
          )}
        </div>

        <button onClick={save}
          className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${saved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
          <Save size={18} />
          {saved ? '✅ تم الحفظ!' : 'حفظ التسجيل اليومي'}
        </button>
      </div>

      {/* Week Overview */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5">
        <h2 className="text-white font-bold mb-4">📊 الأسبوع الأخير</h2>
        <div className="flex gap-2 justify-between">
          {weekHealthData.map((d, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' })
            const moodEmoji = d ? MOODS[d.mood - 1] : '—'
            return (
              <div key={i} className="flex-1 text-center">
                <div className="text-slate-500 text-xs mb-1">{dayName}</div>
                <div className="text-xl mb-1">{moodEmoji}</div>
                {d && <div className={`text-xs font-medium ${d.gym_done ? 'text-purple-400' : 'text-slate-600'}`}>{d.gym_done ? '🏋️' : '—'}</div>}
                {d && <div className="text-xs text-slate-500">{d.sleep_hours}h</div>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Health
