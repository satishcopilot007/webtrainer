# 🚀 Setup Guide - Running TrainerMentors on Another System

**Complete step-by-step instructions to clone, install, and run the TrainerMentors platform on any computer.**

---

## 📋 Prerequisites

Before starting, ensure you have these installed:

### Required
- **Git** - https://git-scm.com/download
- **Node.js** (v18+) - https://nodejs.org/
- **npm** (comes with Node.js)

### Optional (for Backend Development)
- **Python** (v3.10+) - https://www.python.org/
- **PHP** (v8.0+) - for production backend on Hostinger
- **Docker** - For containerized deployment

### Verify Installations
```bash
# Check Node.js version (should be v18 or higher)
node --version

# Check npm version
npm --version

# Check git version
git --version

# Check Python (optional)
python --version
```

---

## 🔧 Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trainermentors.git

# Navigate to project directory
cd trainermentors

# View project structure
ls -la   # Mac/Linux
dir      # Windows
```

---

## ⚙️ Step 2: Configure Environment Variables

### 2A. Root Environment (`.env`)
```bash
# Copy the example file
cp .env.example .env

# Edit the .env file and update:
# - NODE_ENV=development
# - FRONTEND_URL=http://localhost:3000
# - API_URL=http://localhost:8000
# - RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (if using payments)
```

**Windows PowerShell:**
```powershell
Copy-Item .env.example .env
notepad .env  # Edit the file
```

### 2B. Frontend Environment (`.env.local`)
```bash
# Copy the example file
cp frontend/.env.example frontend/.env.local

# Edit and set:
# VITE_API_URL=http://localhost:8000/api
# VITE_RAZORPAY_KEY_ID=YOUR_KEY (optional)
# VITE_TAWK_PROPERTY_ID=YOUR_ID (optional)
```

### 2C. Backend Environment (Optional - if running Python backend)
```bash
# Copy the example file
cp backend/.env.example backend/.env

# Edit with your database credentials
```

### 2D. Backend PHP Environment (Optional - for Hostinger deployment)
```bash
# Copy the example file
cp backend-php/.env.example backend-php/.env

# Edit with your database credentials
```

---

## 📦 Step 3: Install Dependencies

### 3A. Frontend Dependencies
```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install

# Verify installation
npm list

# Return to root directory
cd ..
```

### 3B. Root API Server Dependencies
```bash
# Install Node.js dependencies (for mock API server)
npm install
```

### 3C. Python Backend Dependencies (Optional)
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install Python packages
pip install -r backend/requirements.txt

# Verify installation
pip list
```

---

## 🎯 Step 4: Start the Application

### Option A: Run Both Frontend & API Server (RECOMMENDED FOR DEVELOPMENT)

**Terminal 1 - Start Mock API Server:**
```bash
# From root directory
node mock-api-server.js

# Expected output:
# 🚀 TrainerMentors Mock API Server
# 📍 Running on: http://localhost:8000
# ✅ Ready to connect with React frontend!
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
# From root directory
cd frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000/
# ➜  Network: http://192.168.x.x:3000/
```

**Access the Application:**
- Open browser: http://localhost:3000
- API will automatically connect to http://localhost:8000

---

### Option B: Run with Make Commands (if Makefile is available)

```bash
# Start both servers (requires Make installed)
make dev

# Stop servers
make stop

# View logs
make logs
```

---

### Option C: Run with Docker (Production-like Environment)

```bash
# Prerequisites: Docker and Docker Compose must be installed

# Start services with Docker Compose
docker-compose up --build

# In background:
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# For production:
docker-compose -f docker-compose.prod.yml up --build -d
```

---

## ✅ Step 5: Verify Everything Works

### Test Frontend
1. Go to http://localhost:3000
2. Should see the TrainerMentors homepage with logo
3. Navigate through different pages
4. Verify navigation menu items appear correctly

### Test API Server
1. Go to http://localhost:8000
2. You should see: `✅ Ready to connect with React frontend!`
3. Test API endpoint: http://localhost:8000/api/courses
4. Should return JSON with course data

### Test Course Browsing
1. Click on course categories in navbar
2. Verify courses load and display correctly
3. Click on individual course to see details

### Test Shopping Cart
1. Add course to cart
2. Go to cart page (/cart)
3. Verify items persist (stored in localStorage)
4. Try refreshing page - cart should remain

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Find process using port 3000
# Windows:
netstat -ano | findstr :3000

# Mac/Linux:
lsof -i :3000

# Kill the process (Windows):
taskkill /PID <PID> /F

# Kill the process (Mac/Linux):
kill -9 <PID>

# Or use different port:
cd frontend
npm run dev -- --port 3001
```

### Issue: Dependencies Not Installed

**Error:** `Module not found: '@vite/plugin-react'`

**Solution:**
```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules
rm package-lock.json
npm cache clean --force
npm install
```

### Issue: API Connection Failed

**Error:** `Cannot connect to http://localhost:8000`

**Solution:**
```bash
# Make sure mock API server is running in another terminal
node mock-api-server.js

# Check if port 8000 is open:
# Windows:
netstat -ano | findstr :8000

# Verify VITE_API_URL in frontend/.env.local is correct
# Should be: VITE_API_URL=http://localhost:8000/api
```

### Issue: Node Modules Taking Too Much Space

**Solution:**
```bash
# You can safely delete node_modules
rm -rf node_modules
rm -rf frontend/node_modules

# They'll be reinstalled when you:
npm install
cd frontend && npm install
```

### Issue: Build Fails with Memory Error

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## 🔄 Common Commands

### Frontend Development
```bash
# Start dev server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview

# Run linter
cd frontend && npm run lint
```

### Mock API Server
```bash
# Start API server
node mock-api-server.js

# Test API endpoints
curl http://localhost:8000/api/courses
curl http://localhost:8000/api/categories
```

### Python Backend (Optional)
```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Load course data
python manage.py seed_courses

# Create admin user
python manage.py createsuperuser

# Start Django development server
python manage.py runserver
```

---

## 📁 Project Structure

```
trainermentors/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components for routing
│   │   ├── utils/           # Utility functions & constants
│   │   ├── stores/          # Zustand state management
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   └── .env.local (create from example)
│
├── backend/                  # Django REST API (optional)
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env (create from example)
│
├── backend-php/              # PHP REST API (Hostinger-ready)
│   ├── index.php
│   ├── .env.example
│   └── .env (create from example)
│
├── deployment/               # Docker & deployment configs
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── Deploy-ToHostinger.ps1
│
├── data-tools/               # Python scripts for data management
│   ├── add_courses.py
│   ├── gen_sql.py
│   └── verify_courses.py
│
├── mock-api-server.js        # Express API server for development
├── courses_data.js           # Course catalog (JavaScript)
├── courses_data.json         # Course catalog (JSON)
├── .env.example              # Root environment template
├── .env (create from example)
├── .gitignore                # Git ignore rules
├── package.json              # Root dependencies
├── Makefile                  # Make commands
├── README.md                 # Main documentation
└── SETUP_GUIDE.md            # This file
```

---

## 🚀 Next Steps

### For Development
1. ✅ Install dependencies (Step 3)
2. ✅ Configure environment (Step 2)
3. ✅ Start servers (Step 4)
4. ✅ Begin development

### For Deployment
- See `docs/HOSTINGER_DEPLOYMENT_GUIDE.md` for Hostinger setup
- See deployment folder for Docker configurations
- See `backend-php/README.md` for PHP backend setup

### For Backend Development
- Python Django backend in `backend/` folder
- PHP REST API in `backend-php/` folder
- Course data management in `data-tools/` folder

---

## 📞 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review error messages carefully
3. Verify all ports (3000, 8000) are available
4. Ensure all environment variables are configured
5. Check that Node.js version is v18+

---

## ✨ You're All Set!

Your TrainerMentors platform should now be running! 🎉

- **Frontend:** http://localhost:3000
- **API Server:** http://localhost:8000
- **Mock Data:** 747 courses pre-loaded

Happy coding! 🚀
