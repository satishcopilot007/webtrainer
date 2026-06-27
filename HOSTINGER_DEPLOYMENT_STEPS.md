# Hostinger Deployment - Complete Step-by-Step Guide

**Project:** TrainerMentors  
**Host:** Hostinger Shared Hosting  
**Date:** June 13, 2026

---

## 📋 Pre-Deployment Checklist

### 1. Local Build Verification ✅
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Verify dist/ folder is created
ls dist/
```

### 2. Backend PHP Files Ready ✅
- Files location: `backend-php/` folder
- All `.php` files configured
- Database schema: `backend-php/database.sql`

### 3. Environment Configuration ✅
- Frontend: `.env` configured with `VITE_API_BASE_URL`
- Backend: `.env` will be created on server

---

## 🚀 Deployment Steps

### Step 1: Build Frontend Production Files
```bash
cd frontend
npm install
npm run build
```
**Output:** Creates `frontend/dist/` folder with optimized files

---

### Step 2: Access Hostinger Control Panel

1. **Login to Hostinger Account**
   - Visit: https://hostinger.com
   - Account: your-email@example.com
   - Go to: **Hosting** → **Manage**

2. **Navigate to File Manager**
   - In hPanel, click **File Manager**
   - You'll see: `public_html/` folder (main directory)

---

### Step 3: Upload Frontend Files

**Option A: Using File Manager (Web UI)**
1. Open File Manager in hPanel
2. Navigate to `public_html/`
3. Delete existing files (if any):
   - Old `index.html`
   - Old `css/`, `js/`, `assets/` folders
4. Upload contents of `frontend/dist/`:
   - `index.html`
   - `css/` folder
   - `js/` folder
   - `assets/` folder
   - Any other files from dist

**Option B: Using FTP (Faster for large files)**
1. Get FTP credentials from hPanel:
   - **FTP Host:** (shown in hPanel)
   - **FTP User:** (shown in hPanel)
   - **FTP Pass:** (set in hPanel)

2. Use FileZilla or similar FTP client:
   ```
   Host: ftp.yourserver.com
   User: your_ftp_user
   Pass: your_ftp_password
   Port: 21
   ```

3. Navigate to `/public_html/`
4. Delete old files
5. Upload all files from `frontend/dist/`

---

### Step 4: Upload Backend API Files

1. **Create `/api/` folder** in `public_html/`
   - In File Manager, right-click → New Folder → `api`

2. **Upload backend-php files** to `/api/`:
   - `index.php`
   - `config/` folder
   - `controllers/` folder
   - `middleware/` folder
   - `models/` folder
   - `utils/` folder
   - `.env.example` (as `.env` - see Step 6)
   - `Procfile` (for reference only)
   - `requirements.txt` (for reference only)

3. **Create `/uploads/` folder** in `/api/`:
   - For file uploads if needed

---

### Step 5: Upload .htaccess Files

1. **Upload public_html/.htaccess**
   - File from: `deployment/public_html_htaccess.txt`
   - Upload to: `/public_html/.htaccess`
   - This routes React Router requests properly

2. **Upload api/.htaccess**
   - File from: `deployment/api_htaccess.txt`
   - Upload to: `/public_html/api/.htaccess`
   - This handles API routing

---

### Step 6: Configure Database

1. **Go to Hostinger hPanel → Databases**
   - Click **Create Database**
   - Database name: `trainerment_db`
   - Username: `trainer_user`
   - Password: Generate strong password

2. **Import Database Schema**
   - Go to **phpMyAdmin** (in hPanel)
   - Select your database: `trainerment_db`
   - Click **Import**
   - Upload file: `backend-php/database.sql`
   - Click **Go/Import**

3. **Verify Tables Created**
   - In phpMyAdmin, you should see tables:
     - `users`
     - `courses`
     - `enrollments`
     - etc.

---

### Step 7: Configure Backend .env

1. **In File Manager, navigate to `/public_html/api/`**

2. **Create/Edit `.env` file**:
   - Click on `.env.example` → Rename to `.env`
   - Or create new file `.env`

3. **Add Configuration**:
   ```env
   # Database
   DB_HOST=localhost
   DB_USER=trainer_user
   DB_PASS=your_database_password
   DB_NAME=trainerment_db
   
   # JWT
   JWT_SECRET=your_strong_jwt_secret_key_here
   JWT_EXPIRY=3600
   
   # API
   API_URL=https://yourdomainname.com/api
   FRONTEND_URL=https://yourdomainname.com
   
   # Email (optional)
   MAIL_HOST=smtp.hostinger.com
   MAIL_PORT=465
   MAIL_USER=your-email@yourdomainname.com
   MAIL_PASS=your-email-password
   MAIL_FROM=noreply@yourdomainname.com
   
   # Razorpay (optional)
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxx
   ```

---

### Step 8: Configure Frontend Environment

1. **Check Frontend .env**
   - File: `frontend/.env` (or `.env.production`)
   - Should have:
     ```env
     VITE_API_BASE_URL=https://yourdomainname.com/api
     VITE_TAWK_PROPERTY_ID=your_tawk_id
     VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
     ```

2. **If you need to change it**:
   - Edit `frontend/.env`
   - Run: `npm run build` again
   - Re-upload `frontend/dist/` files

---

### Step 9: Test the Deployment

#### Frontend
1. Open browser: `https://yourdomainname.com`
2. Should see TrainerMentors homepage
3. Test:
   - Navigation menu loads
   - Courses page accessible
   - Responsive design works

#### Backend API
1. Test endpoint: `https://yourdomainname.com/api/courses`
2. Should return JSON with courses list
3. Or check API response with curl:
   ```bash
   curl https://yourdomainname.com/api/courses
   ```

#### Full Workflow
1. Visit homepage
2. Browse courses
3. Add course to cart
4. Test registration/login
5. Check cart persists

---

### Step 10: Enable HTTPS (SSL Certificate)

1. **In Hostinger hPanel**:
   - Go to **Security** → **SSL Certificates**
   - Click **Manage** → **Auto-install SSL** (usually free with Hostinger)
   - Wait 15-30 minutes for activation

2. **Verify SSL**:
   - Browser shows 🔒 lock icon
   - No mixed content warnings

---

## 🔧 Troubleshooting

### Issue: 404 Errors on Page Refresh
**Solution:**
- Check `.htaccess` file is in `/public_html/`
- Verify mod_rewrite is enabled (ask Hostinger support)
- Restart server if needed

### Issue: API Not Responding
**Solution:**
- Check `.env` database credentials
- Verify database is created in phpMyAdmin
- Check `/public_html/api/.htaccess` exists
- Review error logs in Hostinger

### Issue: Uploads Not Working
**Solution:**
- Create `/public_html/api/uploads/` folder
- Set permissions to 755 or 777
- Verify folder is writable

### Issue: Mixed Content (HTTP/HTTPS)
**Solution:**
- Update `.env` to use `https://`
- Clear browser cache
- Rebuild frontend if needed

### Issue: CORS Errors
**Solution:**
- Verify `.htaccess` has CORS headers
- Check `VITE_API_BASE_URL` matches your domain
- Update `FRONTEND_URL` in backend `.env`

---

## 📊 File Structure on Hostinger

```
public_html/
├── index.html              (React main page)
├── css/
├── js/
├── assets/
├── .htaccess               (routing rules)
├── api/
│   ├── index.php           (API entry point)
│   ├── .htaccess           (API routing)
│   ├── .env                (configuration)
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── utils/
└── uploads/                (for file uploads)
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads at `https://yourdomainname.com`
- [ ] All pages accessible via navigation
- [ ] API endpoints responding at `/api/`
- [ ] Database connection working
- [ ] HTTPS certificate active
- [ ] Cart functionality persists
- [ ] User registration works
- [ ] User login works
- [ ] Course filtering works
- [ ] Responsive design on mobile

---

## 🆘 Support Resources

1. **Hostinger Help**: https://support.hostinger.com/
2. **File Manager Guide**: hPanel → Help → File Manager
3. **phpMyAdmin Help**: Inside phpMyAdmin interface
4. **API Testing**: Use Postman or Insomnia for endpoint testing

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**
- Change all default passwords before going live
- Use strong JWT_SECRET (30+ characters)
- Keep database credentials private (never commit `.env`)
- Enable HTTPS (SSL) for all traffic
- Disable directory listing (already in `.htaccess`)
- Set proper file permissions (644 for files, 755 for folders)
- Regularly backup database

---

**Deployment completed!** 🎉

Once live, monitor performance and test all features thoroughly.
