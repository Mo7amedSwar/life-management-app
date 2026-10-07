from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json
import asyncio

router = APIRouter()


class SyncManager:
    """Manages WebSocket connections and broadcasts changes to all connected clients."""

    def __init__(self):
        # device_id → websocket
        self._connections: Dict[str, WebSocket] = {}

    async def connect(self, device_id: str, ws: WebSocket):
        await ws.accept()
        self._connections[device_id] = ws
        print(f"[Sync] ✅ Device connected: {device_id}  (total: {len(self._connections)})")

    def disconnect(self, device_id: str):
        self._connections.pop(device_id, None)
        print(f"[Sync] ❌ Device disconnected: {device_id}  (total: {len(self._connections)})")

    async def broadcast(self, payload: dict, exclude_device: str = None):
        """Send a change event to every connected device except the sender."""
        dead = []
        for dev_id, ws in self._connections.items():
            if dev_id == exclude_device:
                continue
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(dev_id)
        for d in dead:
            self.disconnect(d)

    def online_count(self) -> int:
        return len(self._connections)


# Singleton — shared across all requests
sync_manager = SyncManager()


@router.websocket("/ws/{device_id}")
async def sync_websocket(ws: WebSocket, device_id: str):
    """
    WebSocket endpoint for real-time sync between devices.
    
    Client sends:  { "type": "task_toggle", "payload": { ... } }
    Server pushes: same object to all OTHER connected clients instantly.
    """
    await sync_manager.connect(device_id, ws)

    # Notify everyone that a new device came online
    await sync_manager.broadcast(
        {"type": "device_online", "payload": {"device_id": device_id, "online": sync_manager.online_count()}},
        exclude_device=device_id,
    )

    try:
        while True:
            raw = await ws.receive_text()
            try:
                msg = json.loads(raw)
                # Broadcast the change to all other devices
                await sync_manager.broadcast(msg, exclude_device=device_id)
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        sync_manager.disconnect(device_id)
        await sync_manager.broadcast(
            {"type": "device_offline", "payload": {"device_id": device_id, "online": sync_manager.online_count()}},
        )


@router.get("/status")
def sync_status():
    return {"online_devices": sync_manager.online_count()}
