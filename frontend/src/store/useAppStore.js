import { create } from 'zustand'
import client from '../api/client'

const today = () => new Date().toISOString().split('T')[0]

const useAppStore = create((set, get) => ({
  // ── Core state ─────────────────────────────────────────────
  tasks:        [],
  dailyLog:     null,
  streak:       0,
  syncStatus:   'offline',   // 'online' | 'offline'
  onlineDevices: 0,

  scheduleMode: localStorage.getItem('scheduleMode') || 'college',
  geminiApiKey: localStorage.getItem('GEMINI_API_KEY') || '',
  chatHistory:  JSON.parse(localStorage.getItem('chatHistory') || '[]'),

  // ── Sync status ────────────────────────────────────────────
  setSyncStatus: (status) => set({ syncStatus: status }),

  /**
   * applyRemoteChange — called by useRealtimeSync when another device
   * broadcasts a change. Updates local state WITHOUT broadcasting back.
   */
  applyRemoteChange: (msg) => {
    const { type, payload } = msg
    switch (type) {
      case 'task_toggle':
        set(state => ({
          tasks: state.tasks.map(t =>
            t.id === payload.taskId ? { ...t, completed: payload.completed } : t
          )
        }))
        // Re-cache
        localStorage.setItem('tasks_cache', JSON.stringify(get().tasks))
        break

      case 'daily_log':
        set({ dailyLog: payload })
        localStorage.setItem('daily_log_' + payload.date, JSON.stringify(payload))
        break

      case 'habit_check': {
        const { key, checks } = payload
        localStorage.setItem(key, JSON.stringify(checks))
        // trigger re-render for habits page via a lightweight counter
        set(state => ({ _habitTick: (state._habitTick || 0) + 1 }))
        break
      }

      case 'device_online':
        set({ onlineDevices: payload.online })
        break

      case 'device_offline':
        set({ onlineDevices: payload.online })
        break

      default:
        break
    }
  },

  // ── Settings ───────────────────────────────────────────────
  setGeminiApiKey: (key) => {
    localStorage.setItem('GEMINI_API_KEY', key)
    set({ geminiApiKey: key })
  },

  setScheduleMode: (mode) => {
    localStorage.setItem('scheduleMode', mode)
    set({ scheduleMode: mode })
  },

  // ── Init ───────────────────────────────────────────────────
  initApp: async () => {
    // Tasks — backend first, localStorage fallback
    try {
      const res = await client.get('/tasks')
      set({ tasks: res.data })
      localStorage.setItem('tasks_cache', JSON.stringify(res.data))
    } catch {
      const cached = localStorage.getItem('tasks_cache')
      if (cached) set({ tasks: JSON.parse(cached) })
    }

    // Today's log
    try {
      const res = await client.get('/logs/today')
      set({ dailyLog: res.data })
    } catch {
      const cached = localStorage.getItem('daily_log_' + today())
      if (cached) set({ dailyLog: JSON.parse(cached) })
    }

    get().calculateStreak()
  },

  // ── Tasks ──────────────────────────────────────────────────
  toggleTask: async (taskId, completed, broadcast = null) => {
    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, completed } : t)
    }))
    localStorage.setItem('tasks_cache', JSON.stringify(get().tasks))

    // Sync to other devices
    broadcast?.('task_toggle', { taskId, completed })

    try {
      await client.put(`/tasks/${taskId}?completed=${completed}`)
    } catch { /* offline — already updated locally */ }
  },

  addCustomTask: async (taskData) => {
    try {
      const res = await client.post('/tasks/custom', taskData)
      set(state => ({ tasks: [...state.tasks, res.data] }))
    } catch {
      const newTask = { ...taskData, id: Date.now(), completed: false, custom: true }
      set(state => ({ tasks: [...state.tasks, newTask] }))
    }
    localStorage.setItem('tasks_cache', JSON.stringify(get().tasks))
  },

  deleteCustomTask: async (taskId) => {
    set(state => ({ tasks: state.tasks.filter(t => t.id !== taskId) }))
    localStorage.setItem('tasks_cache', JSON.stringify(get().tasks))
  },

  // ── Daily log ──────────────────────────────────────────────
  updateDailyLog: async (data, broadcast = null) => {
    const logData = { ...get().dailyLog, ...data, date: today() }
    set({ dailyLog: logData })
    localStorage.setItem('daily_log_' + today(), JSON.stringify(logData))
    broadcast?.('daily_log', logData)
    try {
      await client.post('/logs/daily', logData)
    } catch { /* offline ok */ }
    get().calculateStreak()
  },

  calculateStreak: () => {
    let streak = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const key = 'daily_log_' + d.toISOString().split('T')[0]
      const log = localStorage.getItem(key)
      if (log) {
        const parsed = JSON.parse(log)
        if (parsed.hours_studied > 0) streak++
        else break
      } else break
      d.setDate(d.getDate() - 1)
    }
    set({ streak })
  },

  // ── Chat ───────────────────────────────────────────────────
  addChatMessage: (msg) => {
    const history = [...get().chatHistory, msg]
    set({ chatHistory: history })
    localStorage.setItem('chatHistory', JSON.stringify(history))
  },

  clearChatHistory: () => {
    set({ chatHistory: [] })
    localStorage.removeItem('chatHistory')
  },
}))

export default useAppStore
