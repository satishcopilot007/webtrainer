# 📋 Pre-GitHub Setup Checklist

**Complete this checklist before pushing your code to GitHub!**

---

## ✅ Checklist Items

### 1. Project Cleanup
- [ ] Delete `node_modules` directories
  ```bash
  rm -r node_modules
  rm -r frontend/node_modules
  ```

- [ ] Delete `dist` directories (build artifacts)
  ```bash
  rm -r frontend/dist
  rm -r backend/dist
  ```

- [ ] Delete `package-lock.json` and `yarn.lock`
  ```bash
  rm package-lock.json
  rm frontend/package-lock.json
  ```

- [ ] Delete Python cache
  ```bash
  rm -r __pycache__
  find . -name "*.pyc" -delete
  ```

- [ ] Delete `.env` files (keep only `.env.example`)
  ```bash
  rm .env
  rm frontend/.env.local
  rm backend/.env
  rm backend-php/.env
  ```

### 2. Verify .env.example Files
- [ ] `.env.example` in root with all required variables
- [ ] `frontend/.env.example` has all VITE_ variables
- [ ] `backend/.env.example` has all Django config
- [ ] `backend-php/.env.example` has all PHP config
- [ ] All sensitive values are clearly marked `YOUR_VALUE`

### 3. Verify .gitignore
- [ ] `.gitignore` exists in root
- [ ] Includes `node_modules/`
- [ ] Includes `.env`, `.env.local`
- [ ] Includes `*.log` files
- [ ] Includes `dist/`, `build/`
- [ ] Includes `.vscode/`, `.idea/` (IDE configs)
- [ ] Includes `venv/`, `.venv/` (Python)
- [ ] Includes `.DS_Store`, `Thumbs.db` (OS files)

### 4. Documentation
- [ ] `README.md` is comprehensive and up-to-date
- [ ] `QUICK_START.md` exists with 5-minute setup
- [ ] `SETUP_GUIDE.md` exists with detailed steps
- [ ] `GITHUB_PUSH_CHECKLIST.md` is complete (this file)
- [ ] All links in README are correct

### 5. Code Quality
- [ ] No hardcoded API keys or secrets
- [ ] No hardcoded database credentials
- [ ] No hardcoded email addresses
- [ ] No console.log statements in production code
- [ ] No commented-out code blocks (clean up or remove)
- [ ] All imports are used (no unused imports)

### 6. Git Preparation
- [ ] `git init` (initialize repository)
- [ ] Verify `.gitignore` is working
  ```bash
  git status  # Should not show node_modules, .env, etc.
  ```

- [ ] Check what will be committed
  ```bash
  git status
  ```

- [ ] Add all files
  ```bash
  git add .
  ```

- [ ] Verify sensitive files are not staged
  ```bash
  git status  # Should NOT show .env, node_modules, dist/, etc.
  ```

### 7. First Commit
- [ ] Create meaningful commit message
  ```bash
  git commit -m "Initial commit: TrainerMentors platform - React frontend + Node.js mock API"
  ```

### 8. GitHub Repository Setup
- [ ] Create new repository on GitHub (don't initialize with README)
- [ ] Copy repository URL
- [ ] Add remote to local repo
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/trainermentors.git
  ```

- [ ] Verify remote is added
  ```bash
  git remote -v
  ```

### 9. Before First Push
- [ ] Double-check `.gitignore` is working
  ```bash
  git check-ignore -v node_modules/
  git check-ignore -v .env
  ```
  Both should show as ignored ✅

- [ ] Verify correct files are tracked
  ```bash
  git ls-files | head -20  # See what will be pushed
  ```

### 10. Final Push
- [ ] Push to GitHub
  ```bash
  git push -u origin main
  ```

- [ ] Verify on GitHub
  - Visit your repo URL: https://github.com/YOUR_USERNAME/trainermentors
  - Check all files are there
  - Verify NO `.env` files
  - Verify NO `node_modules/` directory
  - Verify NO `dist/` directory

---

## 📝 Prepare Your .gitignore

If `.gitignore` needs updating, ensure it includes:

```gitignore
# Dependencies
node_modules/
package-lock.json
yarn.lock
pip-log.txt
pip-delete-this-directory.txt

# Environment variables (CRITICAL!)
.env
.env.local
.env.*.local

# Build artifacts
dist/
build/
*.egg-info/
__pycache__/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Archives
_not_used/
```

---

## 🚀 Ready to Push?

Once all checks above are complete ✅, you're ready to push:

```bash
# Push to GitHub
git push -u origin main

# Verify on GitHub
# 1. Visit https://github.com/YOUR_USERNAME/trainermentors
# 2. Verify all files are present
# 3. Verify .env files are NOT present
# 4. Verify node_modules/ is NOT present
```

---

## ⚠️ Common Mistakes to Avoid

| ❌ Don't | ✅ Do |
|---------|--------|
| Commit `.env` files | Keep `.env` in `.gitignore` |
| Commit `node_modules/` | Add `node_modules/` to `.gitignore` |
| Commit API keys | Use `.env.example` with placeholder values |
| Commit build artifacts | Add `dist/`, `build/` to `.gitignore` |
| Include IDE configs | Add `.vscode/`, `.idea/` to `.gitignore` |
| Force push to main | Use feature branches for development |
| Large binary files | Use Git LFS or store elsewhere |
| Incomplete README | Document all setup steps |

---

## ✨ Success!

Your repository is ready for GitHub! 🎉

---

## Next Steps After Pushing

1. **Add Repository Details**
   - Description: "Professional online learning platform with React frontend and Node.js backend"
   - URL: (if hosted) your-domain.com
   - Topics: `react`, `nodejs`, `elearning`, `education`, `php`, `python`

2. **Configure Branch Protection** (optional)
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require pull request reviews

3. **Add License**
   - Click "Add file" → Create new file → `LICENSE`
   - Recommend: MIT License (copy from opensource.org/licenses/MIT)

4. **Share with Others**
   - Copy repository URL
   - Share with team members
   - Add collaborators in Settings

---

**Questions?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed help!
