# 🎓 Course Filtering - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Start Backend API Server
```powershell
cd "c:\Users\a160071\OneDrive - AmerisourceBergen(ABC)\Documents\Workspace\Trainerment"
node mock-api-server.js
```
✅ Should show: `[STARTUP] Loaded ALL_COURSES with 139 courses`

### Step 2: Start Frontend (New Terminal)
```powershell
cd "frontend"
npm run dev
```
✅ Should show: `http://localhost:3000` is ready

### Step 3: Open Browser
```
http://localhost:3000/courses/it
```

---

## 🎯 Test All Filters

### Test 1: Level Filter
**Expected**: Select "Advanced" → Show 22 courses only
```
URL: http://localhost:3000/courses/it?level=advanced
```

### Test 2: Mode Filter  
**Expected**: Select "Online" → Show only online courses
```
URL: http://localhost:3000/courses/it?mode=online
```

### Test 3: Combined Filters
**Expected**: Show advanced + online IT courses
```
URL: http://localhost:3000/courses/it?level=advanced&mode=online
```

### Test 4: Category Filter
**Expected**: Switch to Non-IT category → Show 42 courses
```
URL: http://localhost:3000/courses/non-it
```

### Test 5: Search
**Expected**: Type "Python" → Show matching courses
```
URL: http://localhost:3000/courses/it?search=python
```

### Test 6: Get Filter Options
**Expected**: See all available levels, modes, categories
```
API: http://localhost:8000/api/filters
```

---

## 🔍 Quick API Tests

### Using Browser
```
# Test 1: Get all courses
http://localhost:8000/api/courses

# Test 2: Filter by level
http://localhost:8000/api/courses?level=advanced

# Test 3: Filter by mode
http://localhost:8000/api/courses?mode=online

# Test 4: Combined filters
http://localhost:8000/api/courses?main_category=it&level=intermediate&mode=online

# Test 5: Get filter options
http://localhost:8000/api/filters

# Test 6: Search
http://localhost:8000/api/courses?search=python&pageSize=5
```

### Using PowerShell
```powershell
# Get total course count
(Invoke-WebRequest "http://localhost:8000/api/courses?pageSize=1" | ConvertFrom-Json).pagination.total

# Get advanced courses count
(Invoke-WebRequest "http://localhost:8000/api/courses?level=advanced&pageSize=1" | ConvertFrom-Json).pagination.total

# Get online courses count
(Invoke-WebRequest "http://localhost:8000/api/courses?mode=online&pageSize=1" | ConvertFrom-Json).pagination.total
```

---

## 📊 Expected Results

| Test | URL | Expected Result |
|------|-----|-----------------|
| All Courses | `/courses/it` | 89 IT courses |
| Advanced | `/courses/it?level=advanced` | 22 advanced courses |
| Online | `/courses/it?mode=online` | 89 online IT courses |
| Non-IT | `/courses/non-it` | 42 non-IT courses |
| Design | `/courses/design` | 8 design courses |
| API Filters | `GET /api/filters` | 3 levels, 3 modes, 3 categories |

---

## 🐛 Debugging Tips

### Check Backend Logs
Watch for debug messages:
```
[DEBUG] /api/courses endpoint CALLED
[DEBUG] /api/courses - Loaded 139 courses from file
[DEBUG] /api/courses - Returning total: X, page Y, data length: Z
```

### Check Frontend Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "XHR"
4. See API requests and responses

### Test Mode Values
Modes are case-insensitive on backend:
- `online` → matches "Online"
- `OFFLINE` → matches "Offline"
- `Hybrid` → matches "Hybrid"

---

## ✅ How to Verify Everything Works

1. ✅ Backend starts without errors (139 courses loaded)
2. ✅ Frontend loads at http://localhost:3000
3. ✅ Can navigate to `/courses/it`
4. ✅ Can select filters and see results update
5. ✅ Results match expected counts (see table above)
6. ✅ Pagination works (can go to page 2, 3, etc.)
7. ✅ Search finds courses by name
8. ✅ API filters respond with available options

---

## 📈 Course Statistics

```
Total Courses: 139

By Level:
├── Advanced: 22 courses
├── Intermediate: 117 courses
└── Beginner: 0 courses

By Mode (each course has all 3):
├── Online: 139 courses
├── Offline: 139 courses
└── Hybrid: 139 courses

By Main Category:
├── IT: 89 courses
├── Non-IT: 42 courses
└── Design: 8 courses
```

---

## 🎓 Sample Courses

```
1. Fashion Design Course
   - Level: Intermediate
   - Modes: Online, Offline, Hybrid
   - Category: Design
   - Price: ₹20,000

2. Corporate Generative AI Course
   - Level: Intermediate  
   - Modes: Online, Offline, Hybrid
   - Category: IT > Data Science & AI
   - Price: ₹15,000

3. PMP Certification Course
   - Level: Advanced
   - Modes: Online, Offline, Hybrid
   - Category: IT > Project Management
   - Price: ₹25,000
```

---

## 🚨 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Cannot find module 'courses_data.js'" | File exists? Check path in mock-api-server.js |
| Filters not working in UI | Check browser console for errors |
| API returns 500 error | Check backend logs for JSON parsing errors |
| No courses showing | Clear browser cache and hard refresh (Ctrl+Shift+R) |
| Mode filtering returns 0 | Verify courses have `modes` array in courses_data.js |

---

## 📞 Need Help?

1. **Check logs**: Look at backend terminal and browser console
2. **Test API directly**: Use browser to call `/api/courses?level=advanced`
3. **Verify data**: Check courses_data.js has all 139 courses
4. **Read documentation**: See COURSE_FILTERING_SETUP.md for details

---

## 🎉 You're Ready!

The filtering system is now:
- ✅ Fully configured with 139 courses
- ✅ Ready to filter by Level, Mode, Category
- ✅ Prepared for production deployment
- ✅ Scalable for future course additions

**Happy filtering! 🚀**

Last Updated: May 23, 2026
