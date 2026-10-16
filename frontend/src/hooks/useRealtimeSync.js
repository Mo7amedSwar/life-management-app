import { useEffect, useRef, useCallback } from 'react'
import useAppStore from '../store/useAppStore'

// Stable device ID stored in localStorage
const getDeviceId = () => {
  let id = localStorage.getItem('device_id')
  if (!id) {
    id = 'dev_' + Math.random().toString(36).slice(2, 10)
    localStorage.setItem('device_id', id)
  }
  return id
}

const WS_URL = import.meta.env.VITE_WS_URL || (import.meta.env.DEV ? 'ws://localhost:8000/api/sync/ws' : '')

/**
 * useRealtimeSync — connects to the backend WebSocket and:
 * 1. Sends change events when the local state mutates
 * 2. Receives change events from other devices and applies them
 *
 * Usage: call once inside App.jsx   <-- already done
 */
export const useRealtimeSync = () => {
  const wsRef    = useRef(null)
  const deviceId = useRef(getDeviceId())
  const reconnectTimer = useRef(null)
  const { setSyncStatus, applyRemoteChange } = useAppStore()

  const connect = useCallback(() => {
    // Don't double-connect
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    try {
      const ws = new WebSocket(`${WS_URL}/${deviceId.current}`)
      wsRef.current = ws

      ws.onopen = () => {
        setSyncStatus('online')
        console.info('[Sync] 🟢 Connected')
      }

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          applyRemoteChange(msg)
        } catch { /* ignore bad frames */ }
      }

      ws.onclose = () => {
        setSyncStatus('offline')
        console.info('[Sync] 🔴 Disconnected — reconnecting in 3s')
        // Auto-reconnect
        reconnectTimer.current = setTimeout(connect, 3000)
      }

      ws.onerror = () => {
        setSyncStatus('offline')
        ws.close()
      }
    } catch {
      setSyncStatus('offline')
      reconnectTimer.current = setTimeout(connect, 5000)
    }
  }, [setSyncStatus, applyRemoteChange])

  useEffect(() => {
    if (!WS_URL) {
      setSyncStatus('offline')
      return undefined
    }

    connect()
    return () => {
      clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [connect])

  // Expose a function to broadcast changes from this device
  const broadcast = useCallback((type, payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload, from: deviceId.current }))
    }
  }, [])

  return { broadcast, deviceId: deviceId.current }
}

export default useRealtimeSync
