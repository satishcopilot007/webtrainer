# 🎯 START HERE - Quick Reference Card

**Print this page or keep it open while working.**

---

## ⚡ 30-Second Setup

```bash
git clone https://github.com/YOUR_USERNAME/trainermentors.git
cd trainermentors
cp .env.example .env
cp frontend/.env.example frontend/.env.local
npm install && cd frontend && npm install && cd ..
```

Then in **Terminal 1:**
```bash
node mock-api-server.js
```

Then in **Terminal 2:**
```bash
cd frontend && npm run dev
```

Visit: **http://localhost:3000** ✅

---

## 📚 Which Guide Do I Need?

| I want to... | Read this |
|---|---|
| **Get running in 5 min** | [QUICK_START.md](./QUICK_START.md) |
| **Complete setup guide** | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| **Push to GitHub** | [GITHUB_COMPLETE_GUIDE.md](./GITHUB_COMPLETE_GUIDE.md) |
| **Pre-push checklist** | [GITHUB_SETUP_CHECKLIST.md](./GITHUB_SETUP_CHECKLIST.md) |
| **Understand structure** | [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) |
| **Deploy live** | [docs/HOSTINGER_DEPLOYMENT_GUIDE.md](./docs/HOSTINGER_DEPLOYMENT_GUIDE.md) |
| **All guides index** | [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) |

---

## 🔑 Critical Environment Variables

**Create `.env.local` in `frontend/` folder with:**
```ini
VITE_API_URL=http://localhost:8000/api
```

**Create `.env` in root with:**
```ini
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8000
```

---

## 🐛 Quick Fixes

| Problem | Fix |
|---|---|
| Port 3000 in use | `taskkill /PID <PID> /F` (get PID from `netstat -ano \| findstr :3000`) |
| Port 8000 in use | Same as above for port 8000 |
| Module not found | `cd frontend && npm install` |
| API not connecting | Start `node mock-api-server.js` in other terminal |
| Stuck building | `npm cache clean --force` then retry |

---

## 📁 Key Files

| File | Purpose |
|---|---|
| `mock-api-server.js` | Starts API on port 8000 |
| `frontend/src/App.jsx` | Main React component |
| `frontend/src/stores/` | State management (Zustand) |
| `frontend/src/utils/constants.js` | Navigation & categories |
| `courses_data.json` | All 747 courses |
| `.env.example` | Template (copy to .env) |
| `.gitignore` | What NOT to commit |

---

## 🚀 Git Commands (For GitHub)

```bash
# First time only
git init
git add .
git commit -m "Initial commit: TrainerMentors"
git remote add origin https://github.com/USERNAME/trainermentors.git
git branch -M main
git push -u origin main

# After making changes
git add .
git commit -m "Your message"
git push origin main
```

---

## 🔗 Important URLs (When Running Locally)

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API Server | http://localhost:8000 |
| API Docs | http://localhost:8000/ |
| Courses JSON | http://localhost:8000/api/courses |

---

## ✅ Before Pushing to GitHub

- [ ] `rm -r node_modules frontend/node_modules`
- [ ] `rm -r frontend/dist`
- [ ] `rm package-lock.json frontend/package-lock.json`
- [ ] `rm .env frontend/.env.local backend/.env`
- [ ] Verify `.env.example` files exist
- [ ] Run `git status` - no node_modules or .env shown
- [ ] `git check-ignore -v node_modules/` - shows as ignored
- [ ] `git check-ignore -v .env` - shows as ignored

---

## 🎓 Technology Stack

- **Frontend:** React 18 + Vite + TailwindCSS
- **State:** Zustand
- **API:** Express (dev) / PHP (prod)
- **Data:** 747 pre-loaded courses
- **Payment:** Razorpay ready
- **Chat:** Tawk.to integration

---

## 📞 Stuck?

1. Check [QUICK_START.md](./QUICK_START.md) if brand new
2. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) Troubleshooting section
3. Check [GITHUB_COMPLETE_GUIDE.md](./GITHUB_COMPLETE_GUIDE.md) Troubleshooting section
4. Read [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) to understand layout

---

## 💾 What Gets Committed to GitHub

```
✅ YES: frontend/src/, backend/, docs/, README.md, .env.example
❌ NO:  node_modules/, dist/, .env, .env.local, *.log, package-lock.json
```

---

## 🎯 Next Steps After Running

1. ✅ Open http://localhost:3000
2. ✅ Browse courses in navbar
3. ✅ Add course to cart
4. ✅ View cart at `/cart`
5. ✅ Test user registration
6. ✅ View placements page
7. ✅ Check footer social links

---

## 📊 Project Stats

- **Frontend:** React 18.3.1, Vite 5.4.21
- **Courses:** 747 pre-loaded
- **Pages:** 19 different pages
- **Categories:** 6 main categories
- **File Size:** 421.80 KB (gzipped)

---

**Print or bookmark this page for quick reference!** 📌

---

## Where to Go Next?

- **Running the app?** → [QUICK_START.md](./QUICK_START.md)
- **Need help?** → [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Push to GitHub?** → [GITHUB_COMPLETE_GUIDE.md](./GITHUB_COMPLETE_GUIDE.md)
- **See all guides?** → [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
