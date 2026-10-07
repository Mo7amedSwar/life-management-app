from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv
import os

load_dotenv()

from .database import engine, Base
from .routers import tasks, logs, college, chat, sync


# ── Lifespan (replaces deprecated @app.on_event) ─────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create all tables and seed initial data
    Base.metadata.create_all(bind=engine)
    _seed_initial_data()
    yield
    # Shutdown: nothing to clean up for SQLite


def _seed_initial_data():
    """Pre-populate tasks on first run (idempotent)."""
    from .database import SessionLocal
    from .routers.tasks import pre_populate_tasks
    db = SessionLocal()
    try:
        pre_populate_tasks(db)
    finally:
        db.close()


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Life & Learning Management API",
    description="Backend for the 2-Year AI Platform Engineer roadmap tracker",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(tasks.router,   prefix="/api/tasks",   tags=["Tasks"])
app.include_router(logs.router,    prefix="/api/logs",    tags=["Logs"])
app.include_router(college.router, prefix="/api/college", tags=["College"])
app.include_router(chat.router,    prefix="/api/chat",    tags=["Chat"])
app.include_router(sync.router,    prefix="/api/sync",    tags=["Sync"])


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/api/health", tags=["System"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
