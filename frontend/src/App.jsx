import React, { lazy, Suspense, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar        from './components/Sidebar'
import Header         from './components/Header'
import PomodoroTimer  from './components/PomodoroTimer'
import useAppStore    from './store/useAppStore'
import useRealtimeSync from './hooks/useRealtimeSync'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const DailyPlanner = lazy(() => import('./pages/DailyPlanner'))
const Analytics = lazy(() => import('./pages/Analytics'))
const College = lazy(() => import('./pages/College'))
const Health = lazy(() => import('./pages/Health'))
const AIChat = lazy(() => import('./pages/AIChat'))
const Settings = lazy(() => import('./pages/Settings'))
const Resources = lazy(() => import('./pages/Resources'))
const Projects = lazy(() => import('./pages/Projects'))
const Habits = lazy(() => import('./pages/Habits'))

const PageWrapper = ({ children }) => (
  <div className="animate-fade-in pb-mobile">{children}</div>
)

// Inner component so it can call the sync hook (needs to be inside Router context)
function AppInner() {
  const { initApp } = useAppStore()

  // 🔌 Real-time sync — connects WebSocket on mount, auto-reconnects
  useRealtimeSync()

  useEffect(() => { initApp() }, [])

  return (
    <div className="flex h-screen bg-navy text-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Suspense fallback={<div className="p-6 text-slate-400">جارٍ تحميل الصفحة...</div>}>
            <Routes>
              <Route path="/"          element={<PageWrapper><Dashboard /></PageWrapper>} />
              <Route path="/roadmap"   element={<PageWrapper><Roadmap /></PageWrapper>} />
              <Route path="/planner"   element={<PageWrapper><DailyPlanner /></PageWrapper>} />
              <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
              <Route path="/resources" element={<PageWrapper><Resources /></PageWrapper>} />
              <Route path="/projects"  element={<PageWrapper><Projects /></PageWrapper>} />
              <Route path="/habits"    element={<PageWrapper><Habits /></PageWrapper>} />
              <Route path="/college"   element={<PageWrapper><College /></PageWrapper>} />
              <Route path="/health"    element={<PageWrapper><Health /></PageWrapper>} />
              <Route path="/chat"      element={<PageWrapper><AIChat /></PageWrapper>} />
              <Route path="/settings"  element={<PageWrapper><Settings /></PageWrapper>} />
            </Routes>
          </Suspense>
        </main>
      </div>
      {/* 🍅 Floating Pomodoro timer — visible on all pages */}
      <PomodoroTimer />
    </div>
  )
}

export default AppInner
