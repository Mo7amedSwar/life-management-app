# ====================================================================
# deploy-github-pages.ps1
# يرفع الأبليكيشن على GitHub Pages مجاناً — رابط دايم
# ====================================================================
# الاستخدام:
#   .\deploy-github-pages.ps1 -Repo "YOUR_GITHUB_USERNAME/time-manager"
# مثال:
#   .\deploy-github-pages.ps1 -Repo "ahmed123/time-manager"
# ====================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$Repo
)

$ErrorActionPreference = "Stop"
$FrontendDir = "$PSScriptRoot\frontend"

Write-Host ""
Write-Host "🚀 رفع الأبليكيشن على GitHub Pages..." -ForegroundColor Cyan
Write-Host "   Repo: https://github.com/$Repo" -ForegroundColor DarkGray
Write-Host ""

# ── 1. Build ────────────────────────────────────────────────────────
Write-Host "📦 Building..." -ForegroundColor Yellow
Set-Location $FrontendDir
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Build failed!" -ForegroundColor Red; exit 1 }
Write-Host "✅ Build done!" -ForegroundColor Green

# ── 2. Init GitHub Pages branch ─────────────────────────────────────
$distDir = "$FrontendDir\dist"
$ghPagesDir = "$PSScriptRoot\.gh-pages-tmp"

# Clean temp dir
if (Test-Path $ghPagesDir) { Remove-Item -Recurse -Force $ghPagesDir }
New-Item -ItemType Directory -Path $ghPagesDir | Out-Null

Set-Location $ghPagesDir
git init
git checkout -b gh-pages
git remote add origin "https://github.com/$Repo.git"

# Copy dist files
Copy-Item -Path "$distDir\*" -Destination $ghPagesDir -Recurse

# Add .nojekyll so GitHub Pages serves all files
"" | Out-File -FilePath ".nojekyll" -Encoding utf8

# SPA routing fix for GitHub Pages
$notFound = @"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Time Manager</title>
    <script>
      // Redirect to index.html with hash for SPA routing
      var path = window.location.pathname.slice(1);
      window.location.replace(window.location.origin + '/#/' + path);
    </script>
  </head>
</html>
"@
$notFound | Out-File -FilePath "404.html" -Encoding utf8

# ── 3. Commit & Push ────────────────────────────────────────────────
git add .
git commit -m "deploy: Time Manager App $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

Write-Host ""
Write-Host "⬆️  Pushing to GitHub Pages..." -ForegroundColor Yellow
git push -f origin gh-pages
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed! تأكد إنك ضبطت الـ Git credentials" -ForegroundColor Red
    exit 1
}

# ── 4. Done ─────────────────────────────────────────────────────────
$username = $Repo.Split('/')[0]
$reponame = $Repo.Split('/')[1]

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ تم الرفع بنجاح!" -ForegroundColor Green
Write-Host ""
Write-Host "🌍 الرابط الدايم:" -ForegroundColor Cyan
Write-Host "   https://$username.github.io/$reponame" -ForegroundColor White
Write-Host ""
Write-Host "⏳ ممكن يأخذ 2-5 دقائق يظهر — افتح Settings → Pages في GitHub" -ForegroundColor DarkYellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

# Cleanup
Set-Location $PSScriptRoot
Remove-Item -Recurse -Force $ghPagesDir -ErrorAction SilentlyContinue
