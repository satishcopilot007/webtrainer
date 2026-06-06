# 🐙 GitHub Complete Guide

**Everything you need to know to push your code to GitHub and run it on another system.**

---

## Table of Contents

1. [Initial GitHub Setup](#initial-github-setup)
2. [Preparing Code for Push](#preparing-code-for-push)
3. [Git Commands Reference](#git-commands-reference)
4. [Pushing to GitHub](#pushing-to-github)
5. [Cloning and Running on New System](#cloning-and-running-on-new-system)
6. [Troubleshooting](#troubleshooting)

---

## Initial GitHub Setup

### 1. Create GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Enter email, password, username
4. Verify email
5. Complete setup

### 2. Create New Repository

1. Log in to GitHub
2. Click "+" icon (top right) → "New repository"
3. Fill in:
   - **Repository name:** `trainermentors`
   - **Description:** "Professional online learning platform with React frontend and Node.js backend"
   - **Visibility:** Public (or Private)
   - **DO NOT** check "Initialize this repository with a README"
4. Click "Create repository"

### 3. Configure Git Locally

```bash
# Configure Git with your GitHub credentials (do this ONCE)
git config --global user.name "Your Name"
git config --global user.email "your-email@github.com"

# Verify configuration
git config --global --list
```

---

## Preparing Code for Push

### Step 1: Clean Up Project

```bash
# Navigate to project root
cd path/to/trainermentors

# Remove node_modules
rm -r node_modules
rm -r frontend/node_modules

# Remove build artifacts
rm -r frontend/dist
rm -r backend/dist

# Remove lock files
rm package-lock.json
rm frontend/package-lock.json

# Remove .env files (KEEP .env.example!)
rm .env
rm frontend/.env.local
rm backend/.env
rm backend-php/.env
```

**Windows PowerShell:**
```powershell
# Remove directories
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force frontend/node_modules
Remove-Item -Recurse -Force frontend/dist

# Remove files
Remove-Item package-lock.json
Remove-Item frontend/package-lock.json
Remove-Item .env
```

### Step 2: Verify .env.example Files Exist

```bash
# These SHOULD exist
ls .env.example
ls frontend/.env.example
ls backend/.env.example
ls backend-php/.env.example

# These SHOULD NOT exist
ls .env
ls frontend/.env.local
```

### Step 3: Verify .gitignore

```bash
# View .gitignore
cat .gitignore

# Verify it includes:
# - node_modules/
# - .env
# - dist/
# - package-lock.json
```

---

## Git Commands Reference

### Basic Git Workflow

```bash
# 1. Check status (what's changed?)
git status

# 2. Add files to staging area
git add .                    # Add all files
git add filename.js          # Add specific file
git add *.js                 # Add all .js files

# 3. Check what's staged
git status

# 4. Commit changes
git commit -m "Your commit message"

# 5. View commit history
git log
git log --oneline            # Shorter format

# 6. Push to GitHub
git push origin main
```

### Essential Commands

```bash
# Initialize new repository
git init

# Clone existing repository
git clone https://github.com/username/reponame.git
cd reponame

# Add remote (connect to GitHub)
git remote add origin https://github.com/username/reponame.git

# View remotes
git remote -v

# Create and switch to new branch
git checkout -b feature-name

# Switch to existing branch
git checkout main

# List all branches
git branch -a

# Delete local branch
git branch -d feature-name

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename

# View differences
git diff                     # Unstaged changes
git diff --staged            # Staged changes

# Pull latest changes
git pull origin main

# Push to specific branch
git push origin feature-name

# Create pull request (on GitHub after push)
# 1. Go to your repo
# 2. Click "Compare & pull request"
# 3. Add description
# 4. Click "Create pull request"
```

---

## Pushing to GitHub

### First Time Setup

```bash
# 1. Initialize repository (if not already done)
cd path/to/trainermentors
git init

# 2. Check status
git status

# 3. Verify .gitignore is working
git check-ignore -v node_modules/    # Should show as ignored
git check-ignore -v .env              # Should show as ignored

# 4. Add all files
git add .

# 5. Verify what will be committed
git status                            # Should NOT show node_modules or .env

# 6. Create first commit
git commit -m "Initial commit: TrainerMentors platform

- React 18 frontend with Vite
- Node.js Express mock API
- PHP REST API backend
- 747 pre-loaded courses
- Two-tier navigation system
- Shopping cart functionality
- User authentication
- Mobile responsive design"

# 7. Add remote (from your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/trainermentors.git

# 8. Verify remote
git remote -v

# 9. Rename branch to main (if needed)
git branch -M main

# 10. Push to GitHub
git push -u origin main
```

### Subsequent Pushes

```bash
# Make changes
echo "console.log('Hello')" >> newfile.js

# Check what changed
git status

# Add changes
git add .

# Commit
git commit -m "Add: New feature description"

# Push
git push origin main
```

---

## Cloning and Running on New System

### Step 1: Clone Repository

```bash
# Clone from GitHub
git clone https://github.com/YOUR_USERNAME/trainermentors.git

# Navigate to project
cd trainermentors

# View project structure
ls -la          # Mac/Linux
dir             # Windows
```

### Step 2: Setup Environment

```bash
# Copy environment templates
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp backend-php/.env.example backend-php/.env

# Edit .env files with your values
# On Windows:
notepad .env
notepad frontend/.env.local

# On Mac/Linux:
nano .env
nano frontend/.env.local
```

**What to set in `.env`:**
```ini
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:8000
RAZORPAY_KEY_ID=test_key_here (or get from dashboard)
```

**What to set in `frontend/.env.local`:**
```ini
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=test_key_here
VITE_TAWK_PROPERTY_ID=get_from_tawk_if_needed
```

### Step 3: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Verify installations
npm list
cd frontend && npm list && cd ..
```

### Step 4: Start Application

**Terminal 1 - API Server:**
```bash
node mock-api-server.js

# Expected output:
# 🚀 TrainerMentors Mock API Server
# 📍 Running on: http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev

# Expected output:
# ➜  Local:   http://localhost:3000/
# ➜  Network: http://192.168.x.x:3000/
```

### Step 5: Access Application

1. Open browser: http://localhost:3000
2. You should see the TrainerMentors homepage
3. Click around to verify everything works
4. Test:
   - Browse courses
   - Add to cart
   - View cart
   - Try navigation

---

## GitHub Workflow

### For Feature Development

```bash
# 1. Create feature branch
git checkout -b feature/new-feature-name

# 2. Make changes
# ... edit files ...

# 3. Commit regularly
git add .
git commit -m "feat: Add new feature"

# 4. Push branch
git push origin feature/new-feature-name

# 5. On GitHub: Create pull request
# 6. Merge when ready (on GitHub or locally)

# 7. Switch back to main
git checkout main
git pull origin main

# 8. Delete old branch
git branch -d feature/new-feature-name
git push origin --delete feature/new-feature-name
```

### For Fixing Bugs

```bash
# 1. Create bugfix branch
git checkout -b bugfix/description-of-bug

# 2. Fix the bug
# ... edit files ...

# 3. Commit
git add .
git commit -m "fix: Brief description of fix"

# 4. Push and create PR (same as feature)
git push origin bugfix/description-of-bug
```

---

## Troubleshooting

### Common Git Issues

#### ❌ "fatal: not a git repository"

**Cause:** Not in a Git repository directory

**Solution:**
```bash
# Initialize repository
git init

# Or navigate to correct directory
cd path/to/your/project
```

#### ❌ "Permission denied (publickey)"

**Cause:** SSH key not configured

**Solution:**
```bash
# Use HTTPS instead of SSH
git remote add origin https://github.com/username/repo.git

# Or setup SSH key:
# https://docs.github.com/en/authentication/connecting-to-github-with-ssh
```

#### ❌ "Your branch and 'origin/main' have diverged"

**Cause:** Local and remote branches have different commits

**Solution:**
```bash
# Option 1: Merge (recommended)
git pull origin main

# Option 2: Rebase
git rebase origin/main

# Option 3: Hard reset (DANGER - loses local changes)
git reset --hard origin/main
```

#### ❌ ".env file committed by mistake"

**Solution:**
```bash
# Remove from git (but keep in filesystem)
git rm --cached .env

# Add to .gitignore (should already be there)
echo ".env" >> .gitignore

# Commit
git add .gitignore
git commit -m "Remove .env from version control"

# Force push (ONLY if not yet pushed)
git push origin main --force
```

#### ❌ "node_modules accidentally committed"

**Solution:**
```bash
# Remove from git
git rm -r --cached node_modules

# Verify .gitignore has node_modules/
# Commit
git add .
git commit -m "Remove node_modules from version control"

# Push
git push origin main
```

#### ❌ "Port 3000 already in use"

**Windows:**
```powershell
# Find process on port 3000
netstat -ano | findstr :3000

# Kill the process (replace <PID>)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find process
lsof -i :3000

# Kill the process (replace <PID>)
kill -9 <PID>
```

---

## File Organization Before Push

### Should Be Committed ✅

```
✅ frontend/src/           (source code)
✅ backend/                (source code)
✅ backend-php/            (source code)
✅ deployment/             (configs)
✅ data-tools/             (scripts)
✅ .env.example            (template, no secrets)
✅ .gitignore              (rules)
✅ package.json            (dependencies)
✅ README.md               (documentation)
✅ SETUP_GUIDE.md          (instructions)
```

### Should NOT Be Committed ❌

```
❌ node_modules/           (install with npm install)
❌ .env                    (sensitive data)
❌ frontend/.env.local     (sensitive data)
❌ dist/                   (build artifacts)
❌ *.log                   (logs)
❌ .DS_Store               (OS files)
❌ .vscode/               (IDE config)
❌ __pycache__/           (Python cache)
```

---

## GitHub Profile Enhancements

After pushing, consider:

1. **Add description and URL to repo**
   - Go to repository settings
   - Add description, URL, topics

2. **Add topics for discoverability**
   - `react` `nodejs` `elearning` `education`

3. **Add license**
   - MIT License recommended
   - Add LICENSE file with content from https://opensource.org/licenses/MIT

4. **Create GitHub Pages** (optional)
   - Enable in Settings
   - Deploy documentation

5. **Add badges to README**
   ```markdown
   ![GitHub](https://img.shields.io/badge/license-MIT-blue)
   ![React](https://img.shields.io/badge/React-18.3.1-blue)
   ![Node.js](https://img.shields.io/badge/Node.js-20+-green)
   ```

---

## ✅ Complete Checklist for GitHub

- [ ] Project cleanup done (no node_modules, .env, dist)
- [ ] .env.example files present and documented
- [ ] .gitignore configured correctly
- [ ] README.md is comprehensive
- [ ] SETUP_GUIDE.md is created
- [ ] All documentation is linked in README
- [ ] Git initialized: `git init`
- [ ] Files added: `git add .`
- [ ] Initial commit: `git commit -m "..."`
- [ ] Remote added: `git remote add origin ...`
- [ ] First push: `git push -u origin main`
- [ ] GitHub repo shows all files (no .env or node_modules)
- [ ] Another person can clone and run the project
- [ ] Everything working on fresh clone ✅

---

## 🎉 Success!

Your project is now on GitHub and ready for the world!

### Next Actions:
1. Share the URL with your team
2. Update your portfolio
3. Start collaborating!

---

## Resources

- Git Documentation: https://git-scm.com/doc
- GitHub Guides: https://guides.github.com
- GitHub CLI: https://cli.github.com
- GitHub Desktop: https://desktop.github.com

---

**You got this! 🚀**
