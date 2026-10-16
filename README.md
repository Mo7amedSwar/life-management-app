# ════════════════════════════════════════════════════════════
#  README — Time Manager: Senior AI Platform Engineer Track
# ════════════════════════════════════════════════════════════

# 🚀 تشغيل محلي (Local)

```powershell
cd "d:\Time Management\app"
.\start.ps1          # يشغّل Backend + Frontend تلقائياً
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:8000
- API Docs → http://localhost:8000/docs

---

# 📱 تشغيل على الموبايل (نفس الشبكة)

افتح على الموبايل:
```
http://192.168.1.5:5173
```

---

# 🌍 النسخة المنشورة

**الرابط:** https://time-manager-two-sable.vercel.app/

النسخة المجانية على Vercel تعمل كواجهة static. تحفظ خطة التعلم والتقدم والعادات على المتصفح الذي تستخدمه؛ لا توجد مزامنة بين الأجهزة في هذا النشر. المساعد الذكي يحتاج Gemini API Key يضيفه المستخدم من الإعدادات، ولا يدخل المفتاح في ملف النسخة الاحتياطية.

لإعادة النشر يدوياً: شغّل `npm run build` من `frontend` ثم ارفع محتويات `frontend/dist` إلى Vercel. يوجد ملف إعداد Vercel داخل مجلد البناء لدعم الروابط الداخلية.

---

# ⚡ Backend محلي

الـ Backend المحلي يستخدم FastAPI وSQLite، ويمكن تشغيله مع الواجهة باستخدام `start.ps1`. مزامنة WebSocket متاحة عند تشغيل Backend؛ وهي غير مفعلة في النسخة static المنشورة.

---

# 🗂️ Structure

```
app/
├── backend/        FastAPI + SQLite/PostgreSQL
│   ├── routers/    tasks, logs, college, chat, sync (WebSocket)
│   └── main.py
├── frontend/       React + Vite + TailwindCSS
│   └── src/
│       ├── pages/  11 صفحة
│       ├── components/ Sidebar, Header, PomodoroTimer
│       ├── hooks/  useRealtimeSync (WebSocket)
│       └── store/  Zustand (offline-first)
├── start.ps1       تشغيل محلي
├── tunnel.ps1      ngrok tunnel
└── railway.toml    Deploy config
```
