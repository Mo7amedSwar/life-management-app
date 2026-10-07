import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Map, Calendar, BarChart2, Library,
  GraduationCap, Heart, MessageSquare, Settings,
  X, Menu, Hammer, Zap, ChevronDown, ChevronRight
} from 'lucide-react'

const NAV_MAIN = [
  { to: '/',          icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/roadmap',   icon: Map,             label: 'خريطة الطريق' },
  { to: '/planner',   icon: Calendar,        label: 'المخطط اليومي' },
  { to: '/habits',    icon: Zap,             label: 'العادات' },
  { to: '/projects',  icon: Hammer,          label: 'المشاريع' },
  { to: '/analytics', icon: BarChart2,       label: 'التحليلات' },
  { to: '/resources', icon: Library,         label: 'المصادر' },
]

const NAV_PERSONAL = [
  { to: '/college',  icon: GraduationCap, label: 'الكلية' },
  { to: '/health',   icon: Heart,         label: 'الصحة' },
  { to: '/chat',     icon: MessageSquare, label: 'المساعد الذكي' },
  { to: '/settings', icon: Settings,      label: 'الإعدادات' },
]

// Mobile bottom nav — 5 most important
const MOBILE_NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'الرئيسية' },
  { to: '/roadmap',  icon: Map,             label: 'الخطة' },
  { to: '/planner',  icon: Calendar,        label: 'اليوم' },
  { to: '/habits',   icon: Zap,             label: 'العادات' },
  { to: '/projects', icon: Hammer,          label: 'مشاريع' },
]

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink to={to} onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
      }`
    }>
    <Icon size={17} className="flex-shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
)

const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const sidebarContent = (onClose) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
            TM
          </div>
          <div>
            <div className="text-white text-sm font-bold leading-tight">Time Manager</div>
            <div className="text-indigo-400 text-xs">AI Platform Track 🚀</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-2">التعلم والتتبع</p>
        {NAV_MAIN.map(item => <NavItem key={item.to} {...item} onClick={onClose} />)}
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mt-4 mb-2">الشخصي</p>
        {NAV_PERSONAL.map(item => <NavItem key={item.to} {...item} onClick={onClose} />)}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 flex-shrink-0">
        <div className="text-slate-600 text-xs text-center">v1.1.0 — أكتوبر ٢٠٢٦</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        {sidebarContent(null)}
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-2 py-1.5 safe-bottom">
        <div className="flex justify-around">
          {MOBILE_NAV.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to
            return (
              <NavLink key={to} to={to}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                <Icon size={20} />
                <span className="text-xs">{label}</span>
              </NavLink>
            )
          })}
          <button onClick={() => setOpen(true)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500">
            <Menu size={20} />
            <span className="text-xs">المزيد</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
              <span className="text-white font-bold">القائمة</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-all">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent(() => setOpen(false))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
