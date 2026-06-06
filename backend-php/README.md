# TrainerMentors PHP Backend - Quick Reference

## 📁 Project Structure

```
backend-php/
├── config/
│   ├── Config.php          # Configuration constants
│   ├── Database.php        # Database connection
│   └── JWT.php            # JWT token handler
├── middleware/
│   ├── Auth.php           # Authentication middleware
│   └── CORS.php           # CORS headers
├── controllers/
│   ├── BaseController.php  # Base class with helpers
│   ├── AuthController.php  # Auth endpoints
│   ├── CourseController.php # Course endpoints
│   ├── UserController.php   # User endpoints
│   └── EnrollmentController.php # Enrollment endpoints
├── models/
│   ├── UserModel.php       # User database operations
│   ├── CourseModel.php     # Course database operations
│   └── EnrollmentModel.php # Enrollment database operations
├── utils/
│   └── Response.php        # API response formatter
├── uploads/                # User-generated files
├── index.php              # Main API router
├── .htaccess              # Apache configuration
├── .env.example           # Environment template
└── database.sql           # MySQL schema
```

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register           - Register new user
POST   /api/auth/login              - Login user
POST   /api/auth/refresh            - Refresh JWT token
GET    /api/auth/me                 - Get current user (requires auth)
PUT    /api/auth/profile            - Update profile (requires auth)
POST   /api/auth/change-password    - Change password (requires auth)
```

### Courses
```
GET    /api/courses                 - Get all courses (paginated)
GET    /api/courses/:id             - Get course details
POST   /api/courses                 - Create course (mentor/admin only)
PUT    /api/courses/:id             - Update course (mentor/admin only)
DELETE /api/courses/:id             - Delete course (mentor/admin only)
```

### Users
```
GET    /api/users                   - Get all users (admin only)
GET    /api/users/:id               - Get user details
GET    /api/users/:id/courses       - Get user's courses (mentor)
GET    /api/users/:id/enrollments   - Get user's enrollments (student)
POST   /api/users/:id/promote-mentor - Promote to mentor (admin only)
DELETE /api/users/:id               - Delete user (admin only)
```

### Enrollments
```
POST   /api/enrollments             - Enroll in course (requires auth)
GET    /api/enrollments/:id         - Get enrollment details
PUT    /api/enrollments/:id/progress - Update course progress
POST   /api/enrollments/:id/complete - Mark course completed
POST   /api/enrollments/:id/drop    - Drop course
```

---

## 🔐 Authentication

### Getting Access Token

**Step 1: Register or Login**
```bash
curl -X POST https://trainermentors.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "John", "email": "john@example.com", "role": "student" },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Step 2: Use Token in Requests**
```bash
curl -X GET https://trainermentors.com/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## 📝 Common API Patterns

### Pagination
```
GET /api/courses?page=1&pageSize=12
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pageSize": 12,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Filtering
```
GET /api/courses?search=web&category_id=1&mentor_id=5
```

### Error Handling
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

---

## 🛠️ Local Development

### Setup
```bash
# 1. Create database locally
mysql> CREATE DATABASE trainermentors_db;
mysql> USE trainermentors_db;
mysql> source backend-php/database.sql;

# 2. Configure .env
cd backend-php
cp .env.example .env
# Edit .env with local credentials

# 3. Start PHP server
php -S localhost:8000

# 4. Test API
curl http://localhost:8000
```

### Testing with Postman
1. Import collection from `backend-php/postman_collection.json`
2. Set base URL to `http://localhost:8000`
3. Use "Pre-request Script" tab to automatically set Bearer token
4. Run requests

---

## 🔄 Workflow Examples

### Registering a New User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "9876543210"
}
```

### Creating a Course (as Mentor)
```bash
POST /api/courses
Authorization: Bearer <accessToken>
{
  "title": "Advanced Web Development",
  "description": "Learn modern web dev...",
  "category_id": 1,
  "price": 99.99,
  "duration_weeks": 8,
  "level": "advanced",
  "max_students": 30
}
```

### Enrolling in Course
```bash
POST /api/enrollments
Authorization: Bearer <accessToken>
{
  "course_id": 5
}
```

### Updating Course Progress
```bash
PUT /api/enrollments/12/progress
Authorization: Bearer <accessToken>
{
  "progress": 45
}
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_NAME=trainermentors_db
DB_USER=root
DB_PASS=password

# API URLs
API_BASE_URL=https://trainermentors.com/api
FRONTEND_URL=https://trainermentors.com

# JWT
JWT_SECRET=your_secret_key_here

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=https://trainermentors.com,https://www.trainermentors.com
```

### Role-Based Access Control
- **student**: Access own profile, enroll in courses, view courses
- **mentor**: Create/manage own courses, view student progress
- **admin**: Full access to all features, manage users

---

## 🚀 Production Deployment

### Environment Setup
```env
APP_ENV=production
DEBUG=false
```

### Performance Tips
1. Enable database query caching
2. Set appropriate table indexes (already included in schema)
3. Use connection pooling
4. Enable gzip compression in .htaccess
5. Set long cache headers for static files

### Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Set secure CORS_ALLOWED_ORIGINS
- [ ] Use HTTPS only
- [ ] Enable database backups
- [ ] Set proper file permissions (755 for dirs, 644 for files)
- [ ] Hide `.env` file from web access
- [ ] Regular security updates for dependencies

---

## 📊 Database Schema

### Users Table
- id (primary key)
- name, email (unique), password (hashed)
- phone, role (student/mentor/admin)
- profile_image, bio
- is_active, created_at, updated_at

### Courses Table
- id, title (unique slug), description
- category_id (FK), mentor_id (FK)
- price, duration_weeks, level
- max_students, current_students
- thumbnail, rating, is_active

### Enrollments Table
- id, student_id (FK), course_id (FK)
- status (active/completed/dropped)
- progress_percentage, enrollment_date, completion_date

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 404 on API calls | Check `.htaccess` is in place and `mod_rewrite` is enabled |
| Database connection failed | Verify `.env` credentials, check database exists |
| CORS errors | Verify FRONTEND_URL is in ALLOWED_ORIGINS |
| Invalid token errors | Ensure JWT_SECRET is consistent, token not expired |
| Upload failures | Check `uploads/` directory has 755 permissions |

---

## 📚 Resources

- [REST API Best Practices](https://restfulapi.net/)
- [JWT Authentication](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/)
- [PHP Documentation](https://www.php.net/docs.php)

---

## 🎯 Next Steps

1. Customize course models with additional fields
2. Add payment gateway integration (Razorpay)
3. Implement email notifications
4. Add admin dashboard
5. Setup monitoring and logging
6. Performance optimization

**Happy Coding! 🚀**
