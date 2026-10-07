# ============================================================
# start.ps1  —  يشغّل الـ Backend والـ Frontend مع بعض
# الاستخدام: .\start.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$AppDir = $PSScriptRoot

Write-Host ""
Write-Host "🚀 Life & Learning Manager — Starting..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor DarkGray

# ── Backend ──────────────────────────────────────────────────
Write-Host ""
Write-Host "📦 Starting Backend (FastAPI)..." -ForegroundColor Yellow

$backendDir = Join-Path $AppDir "backend"

# Create .env from .env.example if not exists
$envFile = Join-Path $backendDir ".env"
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $backendDir ".env.example") $envFile
    Write-Host "   ⚠️  Created backend/.env — add your GEMINI_API_KEY there!" -ForegroundColor Red
}

# Install backend deps if needed
$sitePackages = pip show fastapi 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "   Installing Python dependencies..." -ForegroundColor DarkGray
    pip install -r (Join-Path $backendDir "requirements.txt") -q
}

# Start backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command",
    "Set-Location '$AppDir'; Write-Host '⚙️  Backend — http://localhost:8000' -ForegroundColor Cyan; python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload"

# ── Frontend ─────────────────────────────────────────────────
Write-Host "🎨 Starting Frontend (React + Vite)..." -ForegroundColor Yellow

$frontendDir = Join-Path $AppDir "frontend"

# Install npm deps if needed
if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
    Write-Host "   Installing npm dependencies..." -ForegroundColor DarkGray
    Push-Location $frontendDir
    npm install-scripts approve esbuild 2>$null
    npm install --silent
    Pop-Location
}

# Start frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command",
    "Set-Location '$frontendDir'; Write-Host '🎨 Frontend — http://localhost:5173' -ForegroundColor Green; npm run dev"

# ── Done ─────────────────────────────────────────────────────
Write-Host ""
Write-Host "✅ Both servers starting in new windows!" -ForegroundColor Green
Write-Host ""
Write-Host "   🌐 Frontend  →  http://localhost:5173" -ForegroundColor White
Write-Host "   ⚙️  Backend   →  http://localhost:8000" -ForegroundColor White
Write-Host "   📚 API Docs  →  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tip: Add your Gemini API Key in Settings page or backend/.env" -ForegroundColor DarkYellow
Write-Host ""

# Auto-open browser after 4 seconds
Start-Sleep -Seconds 4
Start-Process "http://localhost:5173"
