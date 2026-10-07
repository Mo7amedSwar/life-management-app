import React from 'react'
import { useLocation } from 'react-router-dom'
import useAppStore from '../store/useAppStore'
import { Flame } from 'lucide-react'

const PAGE_TITLES = {
  '/':           'الرئيسية',
  '/roadmap':    'خريطة الطريق',
  '/planner':    'المخطط اليومي',
  '/analytics':  'التحليلات',
  '/resources':  'المصادر والمراجع',
  '/projects':   'المشاريع العملية',
  '/habits':     'متابعة العادات',
  '/college':    'الكلية',
  '/health':     'الصحة والعافية',
  '/chat':       'المساعد الذكي',
  '/settings':   'الإعدادات',
}

const Header = () => {
  const location = useLocation()
  const { streak, scheduleMode, setScheduleMode, syncStatus, onlineDevices } = useAppStore()
  const title = PAGE_TITLES[location.pathname] || ''

  const nextMode  = scheduleMode === 'college' ? 'summer' : scheduleMode === 'summer' ? 'exam' : 'college'
  const modeEmoji = scheduleMode === 'college' ? '📚' : scheduleMode === 'summer' ? '☀️' : '📝'

  return (
    <header className="h-14 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0 gap-3">
      <h1 className="text-white font-bold text-lg truncate">{title}</h1>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* 🔴🟢 Sync indicator */}
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
          syncStatus === 'online'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-slate-700/50 border-slate-700 text-slate-500'
        }`}
          title={syncStatus === 'online' ? `${onlineDevices} جهاز متصل` : 'غير متصل — يعمل محلياً'}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            syncStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
          }`} />
          <span className="hidden sm:block">
            {syncStatus === 'online' ? (onlineDevices > 1 ? `${onlineDevices} أجهزة` : 'متصل') : 'Offline'}
          </span>
        </div>

        {/* Schedule mode quick toggle */}
        <button onClick={() => setScheduleMode(nextMode)}
          className="hidden md:flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg transition-colors"
          title={`تغيير وضع الجدول (الحالي: ${scheduleMode})`}>
          <span>{modeEmoji}</span>
          <span className="capitalize">{scheduleMode}</span>
        </button>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm px-2.5 py-1.5 rounded-lg">
            <Flame size={14} />
            <span className="font-bold">{streak}</span>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
