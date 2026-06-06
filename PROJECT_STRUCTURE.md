# 📁 Project Structure Guide

**Detailed explanation of every important file and folder in the TrainerMentors project.**

---

## 🎯 High-Level Architecture

```
trainermentors/
├── 🖥️  frontend/              - React Vite web application (port 3000)
├── 🔌 backend/                - Django REST API (optional, for production)
├── 📱 backend-php/            - PHP REST API (Hostinger-ready, production)
├── 🐳 deployment/             - Docker & deployment configs
├── 🛠️  data-tools/             - Python scripts for data management
├── 📖 docs/                    - Documentation
└── 📝 Root files              - Config & setup files
```

---

## 📂 Frontend Directory (`frontend/`)

### Core Files

**`frontend/src/App.jsx`**
- Main React application component
- Defines all routes and layout
- Imports all pages
- Sets up React Router

**`frontend/src/main.jsx`**
- Entry point for React app
- Initializes React 18 app
- Mounts to DOM

**`frontend/src/index.css`**
- Global CSS styles
- TailwindCSS imports
- Custom utility classes

### Components (`frontend/src/components/`)

```
components/
├── Logo.jsx              - Professional orange TM logo
├── EnhancedNavbar.jsx    - Two-tier navigation system
├── Footer.jsx            - Footer with links and social media
├── SearchBar.jsx         - Course search functionality
├── FilterPanel.jsx       - Course filtering controls
├── CourseCard.jsx        - Reusable course card component
├── Testimonial.jsx       - Student testimonial display
├── LoadingSpinner.jsx    - Loading animation
└── ProtectedRoute.jsx    - Route protection for auth
```

**What to know:**
- Each component is self-contained and reusable
- Components accept props for configuration
- Use React hooks for state management

### Pages (`frontend/src/pages/`)

```
pages/
├── HomePage.jsx              - Homepage with hero & featured courses
├── CourseCatalogPage.jsx    - Browse all courses
├── CourseDetailPage.jsx     - Individual course details
├── CourseCategoryPage.jsx   - Filter by category
├── CartPage.jsx             - Shopping cart
├── LoginPage.jsx            - User login form
├── RegisterPage.jsx         - User registration
├── PlacementsPage.jsx       - Job placements & success stories
├── AboutPage.jsx            - About TrainerMentors
├── BlogListPage.jsx         - Blog posts
├── ContactPage.jsx          - Contact form
├── PrivacyPage.jsx          - Privacy policy
├── TermsPage.jsx            - Terms of service
├── WebinarPage.jsx          - Webinar information
├── CertificatePage.jsx      - Certificate details
├── CorporatePage.jsx        - Corporate training
├── CSRPage.jsx              - Corporate social responsibility
├── FreeCoursesPage.jsx      - Free courses listing
├── FeedbackPage.jsx         - User feedback form
├── ReferralPage.jsx         - Referral program
├── CareersPage.jsx          - Careers & hiring
└── TestimonialsPage.jsx     - Student testimonials
```

**What to know:**
- Each page corresponds to a route
- Pages use page-level components
- Pages fetch data from API or store

### Stores (`frontend/src/stores/`)

```
stores/
├── useAuthStore.js       - User authentication state (Zustand)
├── useCartStore.js       - Shopping cart state (with localStorage persistence)
├── useCourseStore.js     - Course catalog state
└── useUserStore.js       - User profile state
```

**What to know:**
- Uses Zustand for simple, effective state management
- `useCartStore` persists to localStorage
- Each store is a hook you import and use
- State is global across all components

### Utils (`frontend/src/utils/`)

```
utils/
├── constants.js          - Navigation links, categories, API endpoints
├── api.js               - Axios API client configuration
└── helpers.js           - Utility functions
```

**`constants.js` contains:**
- `PRIMARY_NAV_LINKS` - Top navigation menu items (11 items)
- `SECONDARY_NAV_LINKS` - Category links (6 categories)
- `COURSE_CATEGORIES` - Course category definitions
- `API_BASE_URL` - Backend API URL

### Configuration Files

**`frontend/package.json`**
- Frontend dependencies (React, Vite, TailwindCSS, Zustand, etc.)
- NPM scripts: `npm run dev`, `npm run build`, `npm run preview`

**`frontend/vite.config.js`**
- Vite bundler configuration
- Plugin setup (React, etc.)
- Development server config (port 3000, host)

**`frontend/tailwind.config.js`**
- TailwindCSS configuration
- Custom colors, fonts, spacing
- Theme definitions

**`frontend/postcss.config.js`**
- PostCSS configuration
- TailwindCSS and Autoprefixer setup

**`frontend/.env.example`**
- Template for environment variables
- Copy to `.env.local` for development
- Contains:
  - `VITE_API_URL` - Backend API URL
  - `VITE_RAZORPAY_KEY_ID` - Razorpay key (optional)
  - Social media links (optional)

---

## 🔌 Backend Directory (`backend/`)

Django REST API backend (Python).

```
backend/
├── manage.py             - Django management script
├── requirements.txt      - Python dependencies
├── .env.example          - Template for environment variables
├── Procfile             - Heroku/Render deployment config
├── render.yaml          - Render.com deployment config
├── config/              - Django settings
│   ├── settings.py      - Main configuration
│   ├── urls.py          - URL routing
│   └── wsgi.py          - WSGI app for deployment
├── apps/
│   ├── users/           - User management
│   ├── courses/         - Course management
│   ├── enrollments/     - Student enrollments
│   └── payments/        - Payment handling
```

**Common Django Commands:**
```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Load sample data
python manage.py seed_courses

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

---

## 📱 Backend PHP Directory (`backend-php/`)

PHP REST API backend (production-ready for Hostinger).

```
backend-php/
├── index.php            - API entry point
├── database.sql         - Database schema
├── .env.example         - Template for environment variables
├── config/
│   ├── Database.php     - Database connection
│   └── Config.php       - Application configuration
├── controllers/
│   ├── AuthController.php      - Authentication & registration
│   ├── CourseController.php    - Course management
│   ├── UserController.php      - User management
│   └── EnrollmentController.php - Enrollment management
├── models/
│   ├── User.php         - User model
│   ├── Course.php       - Course model
│   └── Enrollment.php   - Enrollment model
├── middleware/
│   └── AuthMiddleware.php      - JWT authentication
├── utils/
│   ├── jwt.php          - JWT token handling
│   └── Response.php     - API response formatting
└── api/
    ├── auth.php         - Authentication endpoints
    ├── courses.php      - Course endpoints
    └── users.php        - User endpoints
```

**Key Features:**
- JWT authentication with HS256
- MySQL database support
- RESTful API design
- 20+ endpoints implemented
- CORS enabled
- Ready for Hostinger deployment

---

## 🐳 Deployment Directory (`deployment/`)

Docker and deployment configurations.

**`deployment/docker-compose.yml`**
- Development Docker setup
- Services: frontend (port 3000), backend (port 8000)
- Volumes for live reload
- Networks for service communication

**`deployment/docker-compose.prod.yml`**
- Production Docker setup
- Optimized images
- Health checks
- Resource limits

**`deployment/Deploy-ToHostinger.ps1`**
- PowerShell script for Hostinger deployment
- Automates FTP upload
- Database setup
- Configuration

**`deployment/api_htaccess.txt`**
- .htaccess rules for API routes (Hostinger)
- URL rewriting for REST API

**`deployment/public_html_htaccess.txt`**
- .htaccess rules for frontend (Hostinger)
- React Router support
- Static file serving

---

## 🛠️ Data Tools Directory (`data-tools/`)

Python scripts for course catalog management.

**`add_courses.py`**
- Add new courses to catalog
- Command: `python add_courses.py`

**`import_excel_courses.py`**
- Import courses from Excel file
- Batch add multiple courses

**`import_koenig_courses.py`**
- Scrape courses from Koenig Solutions
- Automatically fetch course data

**`gen_sql.py`**
- Generate SQL INSERT statements
- For database import

**`regen_js.py`**
- Regenerate `courses_data.js` from JSON
- Update mock API data

**`verify_courses.py`**
- Validate course catalog integrity
- Check for missing fields
- Verify data format

**`parse_courses.py`**
- Parse and format course data
- Clean up duplicate/invalid data

---

## 📖 Documentation Directory (`docs/`)

Reference guides and documentation.

**`GETTING_STARTED.md`**
- Beginner's guide
- Installation steps
- Running the project

**`RAZORPAY_SETUP_GUIDE.md`**
- Razorpay payment integration
- API key setup
- Test & live modes

**`EMAIL_INTEGRATION_GUIDE.md`**
- Email service setup
- Gmail SMTP configuration
- Email notifications

**`HOSTINGER_DEPLOYMENT_GUIDE.md`**
- Step-by-step Hostinger deployment
- Domain setup
- SSL configuration
- Database migration

**`FILTER_EXAMPLES.md`**
- Course filtering examples
- API parameters
- Frontend usage

**`COURSE_FILTERING_SETUP.md`**
- Advanced filtering setup
- Category filters
- Price filters
- Rating filters

---

## 📝 Root Level Files

### Setup & Configuration

**`.env.example`**
- Root environment template
- Backend API configuration
- Database settings
- Optional email setup

**`.gitignore`**
- Git ignore rules
- Prevents committing node_modules, .env, etc.
- OS-specific ignores

**`package.json`**
- Root dependencies
- Mock API server dependencies (Express, CORS, JWT)
- Scripts: `node mock-api-server.js`

**`Makefile`**
- Convenient commands
- `make dev` - start development
- `make stop` - stop services
- `make logs` - view logs

### Data Files

**`courses_data.json`**
- Course catalog in JSON format
- Contains 747 courses
- Source of truth for course data

**`courses_data.js`**
- Course catalog exported as JavaScript
- Used by mock API server
- Easier for Node.js/browser

**`mock-api-server.js`**
- Express.js API server
- Listens on port 8000
- Pre-loads course data
- JWT token support
- CORS enabled

### Documentation

**`README.md`**
- Main project documentation
- Quick start guide
- Features overview
- API endpoints
- Architecture

**`QUICK_START.md`**
- 5-minute quick start
- TL;DR version
- Essential commands only

**`SETUP_GUIDE.md`**
- Comprehensive setup guide
- Step-by-step instructions
- Troubleshooting
- For new systems/clones

**`GITHUB_SETUP_CHECKLIST.md`**
- Pre-GitHub push checklist
- Cleanup instructions
- .gitignore verification
- Security checks

**`GITHUB_PUSH_CHECKLIST.md`**
- GitHub push preparation
- Commit steps
- Verification

**`emailService.js`**
- Email service module
- Gmail SMTP integration
- Notification emails

**`test_response.json`**
- Sample API response
- For testing
- Reference data

---

## 📊 Course Data Structure

### courses_data.json Format

```json
{
  "courses": [
    {
      "id": 1,
      "name": "Business Analyst",
      "category": "job-oriented",
      "price": 0,
      "duration": "40 hours",
      "level": "Beginner",
      "rating": 4.5,
      "reviews": 156,
      "description": "...",
      "image": "https://...",
      "instructor": "...",
      "skills": ["skill1", "skill2"]
    }
  ]
}
```

### Categories

```json
{
  "id": "job-oriented",
  "name": "Job Oriented Courses",
  "description": "Courses designed for job placement",
  "count": 3
}
```

---

## 🔄 Data Flow

```
User visits http://localhost:3000
    ↓
React app loads (frontend/)
    ↓
Zustand store initialized with empty state
    ↓
App fetches http://localhost:8000/api/courses
    ↓
Mock API server responds with courses_data.js
    ↓
Zustand store updated with courses
    ↓
Components re-render with course data
    ↓
User sees 747 courses displayed
```

---

## 🧭 Navigation Structure

### Two-Tier Navigation System

**Primary Navigation** (Top Menu - 11 items)
```javascript
[
  "Certificate", "Webinar", "Corporate", "CSR",
  "Blogs", "Students Reviews", "Referral",
  "Free Courses", "Feedback", "Careers", "Contact"
]
```

**Secondary Navigation** (Category Links - 6 items)
```javascript
[
  "Job Oriented Courses",
  "IT Courses",
  "Non-IT Courses",
  "About Us",
  "Placements",
  "Corporate Courses"
]
```

---

## 🔐 Authentication Flow

```
User Registration
    ↓
POST /api/auth/register (with name, email, password)
    ↓
Backend hashes password, stores in DB
    ↓
Returns JWT token
    ↓
Frontend stores token in localStorage (useAuthStore)
    ↓
Token sent with every API request (Authorization header)
    ↓
Token expires in 1 hour (or refresh if needed)
```

---

## 💾 State Management (Zustand Stores)

### useAuthStore
```javascript
{
  user: { id, name, email, role },
  token: "jwt_token_here",
  isAuthenticated: true,
  login(email, password): Promise
  register(name, email, password): Promise
  logout(): void
}
```

### useCartStore
```javascript
{
  items: [{ courseId, name, price }],
  totalPrice: number,
  addToCart(course): void
  removeFromCart(courseId): void
  clearCart(): void
  // Persisted to localStorage
}
```

### useCourseStore
```javascript
{
  courses: [{ id, name, category, price }],
  selectedCategory: "all",
  searchTerm: "",
  filteredCourses: array,
  fetchCourses(): Promise
  filterByCategory(category): void
  searchCourses(term): void
}
```

---

## 🚀 Deployment Targets

### Development
- **Frontend:** http://localhost:3000 (Vite dev server)
- **API:** http://localhost:8000 (Mock API server)
- **Database:** In-memory or localStorage

### Production
- **Frontend:** Hostinger `public_html/` folder (static files)
- **API:** Hostinger `api/` folder (PHP REST API)
- **Database:** Hostinger MySQL database
- **Domain:** yourdomain.com

---

## 📚 Key Dependencies

### Frontend (`package.json`)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^5.4.21",
  "tailwindcss": "^3.4.4",
  "zustand": "^4.5.2",
  "framer-motion": "^11.2.10",
  "axios": "^1.7.2",
  "react-router-dom": "^6.23.1"
}
```

### Backend (`requirements.txt`)
```
Django>=5.1
djangorestframework>=3.15
django-cors-headers>=4.3
psycopg2-binary>=2.9
gunicorn>=22.0
```

### API Server (`package.json`)
```json
{
  "express": "^5.2.1",
  "cors": "^2.8.6",
  "body-parser": "^2.2.2",
  "jsonwebtoken": "^9.0.3"
}
```

---

## ✅ You're Now a Project Navigator!

You understand the complete structure of the TrainerMentors project. Happy coding! 🎉

For more details, see specific guides:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - How to run
- [QUICK_START.md](./QUICK_START.md) - 5-minute setup
- [GITHUB_SETUP_CHECKLIST.md](./GITHUB_SETUP_CHECKLIST.md) - Before pushing to GitHub
