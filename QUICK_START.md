# ⚡ Quick Start - Run Locally in 5 Minutes

**Prerequisites:** Node.js 18+ installed ([download](https://nodejs.org))

---

## 🔄 One-Time Setup (First Time Only)

### Step 1: Clone the repo
```bash
git clone https://github.com/satishcopilot007/webtrainer.git
cd webtrainer
git checkout production-stable
```

### Step 2: Create environment files

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
Copy-Item frontend/.env.example frontend/.env.local
```

**Mac/Linux:**
```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

> No changes needed in .env files for local development — defaults work out of the box.

### Step 3: Install dependencies
```bash
npm install
cd frontend
npm install
cd ..
```

**Setup complete!** ✅

---

## ▶️ Run the App (Every Time)

Open **two terminals** in the project root folder:

### Terminal 1 — API Server (mock backend):
```bash
node mock-api-server.js
```
You should see: `Mock API server running on port 8000`

### Terminal 2 — Frontend dev server:
```bash
cd frontend
npm run dev
```
You should see: `Local: http://localhost:3000`

### Open Browser:
```
http://localhost:3000
```

**That's it!** 🎉 All 897 courses with syllabus, tier pricing, and full features work locally.

---

## 📁 What's Running

| Service | URL | Source |
|---------|-----|--------|
| Frontend (React/Vite) | http://localhost:3000 | `frontend/src/` |
| Mock API (Express) | http://localhost:8000 | `mock-api-server.js` + `courses_data.js` |

The mock server uses local `courses_data.js` (all 897 courses with modules, tiers, etc.) — **no database needed locally**.

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | `taskkill /PID <PID> /F` (Windows) or `kill -9 <PID>` (Mac/Linux) |
| Port 8000 in use | Same as above, use port 8000 |
| Module not found | `cd frontend && npm install` |
| API not connecting | Ensure mock-api-server.js is running |
| Stuck on building | `npm cache clean --force` and retry |

---

## 📚 Full Guide

For complete setup details, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

---

## 🌐 Features Ready to Test

- ✅ Browse 747 courses
- ✅ Filter by category (Job-oriented, IT, Non-IT, etc.)
- ✅ View course details
- ✅ Add courses to cart
- ✅ User authentication
- ✅ View placements & testimonials
- ✅ Mobile responsive design

Enjoy! 🚀
