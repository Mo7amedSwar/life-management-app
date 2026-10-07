import React, { useEffect, useState } from 'react'
import useAppStore from '../store/useAppStore'
import { Target, Flame, Clock, CheckCircle, BookOpen, TrendingUp, Zap, Calendar } from 'lucide-react'

const PHASES = [
  { id: 0, name: 'Phase 0', title: 'الأساس والانتظام', color: 'from-purple-600 to-purple-800', period: 'أكتوبر - نوفمبر ٢٠٢٦' },
  { id: 1, name: 'Phase 1', title: 'Linux + Python + Git', color: 'from-blue-600 to-blue-800', period: 'ديسمبر ٢٠٢٦ - فبراير ٢٠٢٧' },
  { id: 2, name: 'Phase 2', title: 'Cloud + Containers + K8s', color: 'from-cyan-600 to-cyan-800', period: 'مارس - يونيو ٢٠٢٧' },
  { id: 3, name: 'Phase 3', title: 'AI/ML + MLOps', color: 'from-emerald-600 to-emerald-800', period: 'يوليو - أكتوبر ٢٠٢٧' },
  { id: 4, name: 'Phase 4', title: 'CI/CD + IaC + Observability', color: 'from-orange-600 to-orange-800', period: 'نوفمبر ٢٠٢٧ - مارس ٢٠٢٨' },
  { id: 5, name: 'Phase 5', title: 'Integration + Brand + Leadership', color: 'from-rose-600 to-rose-800', period: 'أبريل - أكتوبر ٢٠٢٨' },
]

const QUOTES = [
  'النجاح ليس نهائياً، والفشل ليس قاتلاً — الشجاعة على الاستمرار هي ما يهم.',
  'كل يوم تتعلم فيه شيئاً جديداً، أنت أقوى من أمس.',
  'لا يوجد اختصار للقمة — لكن هناك طريق واضح لمن يلتزم.',
  'الـ Consistency أقوى من الـ Intensity. يوم واحد عادي كل يوم يساوي سنة استثنائية.',
  'ابنِ المهارات وأنت شاب — ستدفع لك طوال حياتك.',
  'الناس اللي بتنجح مش بيشتغلوا أكتر — بيشتغلوا أذكى.',
]

const GREETINGS = {
  morning: '🌅 صباح الخير!',
  afternoon: '☀️ مساء النور!',
  evening: '🌙 مساء الخير!',
  night: '⭐ ليلة سعيدة!',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return GREETINGS.morning
  if (h >= 12 && h < 17) return GREETINGS.afternoon
  if (h >= 17 && h < 21) return GREETINGS.evening
  return GREETINGS.night
}

function getCurrentPhase(tasks) {
  // Find the first phase where not all tasks are done
  for (let p = 0; p <= 5; p++) {
    const phaseTasks = tasks.filter(t => t.phase === p)
    const done = phaseTasks.filter(t => t.completed).length
    if (done < phaseTasks.length) return p
  }
  return 5
}

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-slate-400 text-sm">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
)

const Dashboard = () => {
  const { tasks, dailyLog, streak } = useAppStore()
  const [time, setTime] = useState(new Date())
  const quote = QUOTES[new Date().getDate() % QUOTES.length]

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const currentPhase = getCurrentPhase(tasks)
  const phaseInfo = PHASES[currentPhase]
  const phaseTasks = tasks.filter(t => t.phase === currentPhase)
  const doneInPhase = phaseTasks.filter(t => t.completed).length
  const phaseProgress = phaseTasks.length ? Math.round((doneInPhase / phaseTasks.length) * 100) : 0

  const totalTasks = tasks.length
  const totalDone = tasks.filter(t => t.completed).length
  const overallProgress = totalTasks ? Math.round((totalDone / totalTasks) * 100) : 0

  const todayDone = dailyLog?.tasks_completed || 0
  const studiedHours = dailyLog?.hours_studied || 0

  const timeStr = time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
  const dateStr = time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6 pb-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900 border border-indigo-700/30 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{getGreeting()}</h1>
            <p className="text-slate-400 text-lg">{dateStr}</p>
            <p className="text-indigo-400 text-3xl font-mono font-bold mt-2">{timeStr}</p>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-sm mb-1">التقدم الإجمالي</div>
            <div className="text-5xl font-black text-white">{overallProgress}<span className="text-2xl text-indigo-400">٪</span></div>
            <div className="text-slate-500 text-xs mt-1">{totalDone} / {totalTasks} مهمة منجزة</div>
          </div>
        </div>
        <div className="mt-4 bg-slate-700/40 rounded-full h-2">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }} />
        </div>
        <p className="text-slate-400 text-sm mt-4 italic">"{quote}"</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Streak" value={`${streak || 0} يوم`} color="bg-orange-500/20" />
        <StatCard icon={Clock} label="ساعات اليوم" value={`${studiedHours}h`} color="bg-blue-500/20" />
        <StatCard icon={CheckCircle} label="مهام اليوم" value={todayDone} color="bg-emerald-500/20" />
        <StatCard icon={TrendingUp} label="المرحلة الحالية" value={`Phase ${currentPhase}`} color="bg-purple-500/20" />
      </div>

      {/* Current Phase Card */}
      <div className={`bg-gradient-to-br ${phaseInfo.color} rounded-2xl p-6 border border-white/10`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-white/70 text-sm font-medium mb-1">أنت الآن في</div>
            <h2 className="text-2xl font-bold text-white">{phaseInfo.name}: {phaseInfo.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={14} className="text-white/60" />
              <span className="text-white/60 text-sm">{phaseInfo.period}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-white">{phaseProgress}<span className="text-lg">٪</span></div>
            <div className="text-white/60 text-xs">{doneInPhase}/{phaseTasks.length}</div>
          </div>
        </div>
        <div className="bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full transition-all duration-700" style={{ width: `${phaseProgress}%` }} />
        </div>
        <p className="text-white/60 text-sm mt-3">أكمل هذه المرحلة للوصول لـ Phase {currentPhase + 1}</p>
      </div>

      {/* All Phases Overview */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">خريطة الرحلة كاملة</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PHASES.map(p => {
            const pts = tasks.filter(t => t.phase === p.id)
            const done = pts.filter(t => t.completed).length
            const pct = pts.length ? Math.round((done / pts.length) * 100) : 0
            const isCurrent = p.id === currentPhase
            return (
              <div key={p.id} className={`rounded-xl p-4 border transition-all ${isCurrent ? 'border-indigo-500 bg-indigo-900/40' : 'border-slate-700/50 bg-slate-800/40'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-xs text-slate-400">{p.name}</div>
                    <div className="text-sm font-semibold text-white leading-tight">{p.title}</div>
                  </div>
                  <span className={`text-lg font-bold ${pct === 100 ? 'text-emerald-400' : isCurrent ? 'text-indigo-400' : 'text-slate-500'}`}>{pct}٪</span>
                </div>
                <div className="bg-slate-700 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full bg-gradient-to-r ${p.color}`} style={{ width: `${pct}%` }} />
                </div>
                <div className="text-xs text-slate-500 mt-1">{done}/{pts.length} مهمة</div>
                {isCurrent && <div className="text-xs text-indigo-400 mt-1 font-medium">▶ الآن</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">روابط سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'سجّل ساعات اليوم', icon: Clock, href: '/planner', color: 'from-blue-600 to-blue-800' },
            { label: 'تابع الخطة', icon: Target, href: '/roadmap', color: 'from-indigo-600 to-indigo-800' },
            { label: 'تحدث مع AI', icon: Zap, href: '/chat', color: 'from-emerald-600 to-emerald-800' },
            { label: 'مواد الكلية', icon: BookOpen, href: '/college', color: 'from-purple-600 to-purple-800' },
          ].map(({ label, icon: Icon, href, color }) => (
            <a key={href} href={href} onClick={e => { e.preventDefault(); window.location.hash = href }} className={`bg-gradient-to-br ${color} rounded-xl p-4 flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform cursor-pointer border border-white/10`}>
              <Icon size={24} className="text-white" />
              <span className="text-white text-sm font-medium">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
