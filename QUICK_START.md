# ⚡ Quick Start - 5 Minutes to Running

**TL;DR version - get the app running in 5 minutes!**

---

## 🔄 One-Time Setup (First Time Only)

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/trainermentors.git
cd trainermentors

# 2. Copy environment files
cp .env.example .env
cp frontend/.env.example frontend/.env.local

# 3. Install dependencies
npm install
cd frontend && npm install && cd ..
```

**Done!** ✅

---

## ▶️ Every Time You Want to Run

### Terminal 1:
```bash
node mock-api-server.js
```

### Terminal 2:
```bash
cd frontend && npm run dev
```

### Open Browser:
```
http://localhost:3000
```

**Done!** 🎉

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
