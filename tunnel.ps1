# ============================================================
# tunnel.ps1  —  يفتح الأبليكيشن على الإنترنت باستخدام ngrok
# الاستخدام: .\tunnel.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$AppDir = $PSScriptRoot

Write-Host ""
Write-Host "🌐 فتح التونل للإنترنت..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor DarkGray

# ── تحقق إن ngrok موجود ──────────────────────────────────────
$ngrokPath = (Get-Command ngrok -ErrorAction SilentlyContinue)?.Source
if (-not $ngrokPath) {
    Write-Host "❌ ngrok مش موجود. بنحاول نثبّته..." -ForegroundColor Red
    winget install ngrok.ngrok
}

# ── تحقق إن البروجرام شغّال ──────────────────────────────────
$frontendRunning = Test-NetConnection -ComputerName localhost -Port 5173 -InformationLevel Quiet -WarningAction SilentlyContinue
if (-not $frontendRunning) {
    Write-Host "⚠️  الأبليكيشن مش شغّال — شغّل .\start.ps1 الأول!" -ForegroundColor Yellow
    Write-Host ""
    $answer = Read-Host "عايز أشغّله دلوقتي؟ (y/n)"
    if ($answer -eq 'y') {
        Start-Process powershell -ArgumentList "-File `"$AppDir\start.ps1`""
        Write-Host "استنى ١٠ ثواني..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
    }
}

# ── شغّل ngrok ───────────────────────────────────────────────
Write-Host ""
Write-Host "🚀 بيفتح التونل على port 5174..." -ForegroundColor Yellow
Write-Host "   (لازم تسجّل على ngrok.com مرة واحدة وتربط الـ token)" -ForegroundColor DarkGray
Write-Host ""

# Check if token is configured
$configCheck = ngrok config check 2>&1
if ($configCheck -match "valid") {
    # Token exists, start tunnel
    Start-Process powershell -ArgumentList "-NoExit", "-Command",
        "Write-Host '🌐 التونل شغّال — انسخ الـ URL الأخضر وافتحه على الموبايل' -ForegroundColor Green; ngrok http 5174"
} else {
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host "📋 خطوات مرة واحدة بس:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   1️⃣  اذهب لـ: https://dashboard.ngrok.com/signup" -ForegroundColor White
    Write-Host "   2️⃣  سجّل حساب مجاني" -ForegroundColor White
    Write-Host "   3️⃣  انسخ الـ Authtoken من الداشبورد" -ForegroundColor White
    Write-Host "   4️⃣  شغّل الأمر ده:" -ForegroundColor White
    Write-Host ""
    Write-Host "        ngrok config add-authtoken YOUR_TOKEN_HERE" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   5️⃣  بعدين شغّل tunnel.ps1 تاني" -ForegroundColor White
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "أو لو مش عايز تسجّل — استخدم Cloudflare Tunnel (انظر README)" -ForegroundColor DarkGray

    # Open signup page
    Start-Process "https://dashboard.ngrok.com/signup"
}
