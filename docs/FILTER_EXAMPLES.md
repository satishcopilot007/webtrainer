# Course Filtering - Visual Examples & Use Cases

## 🎯 Real-World Filtering Scenarios

### Scenario 1: Student Looking for Beginner-Friendly Online Courses
```
User: "I want to learn Data Science online, but I'm a beginner"

Steps:
1. Navigate to: /courses/it
2. Select Filter: Level = "Beginner"
3. Select Filter: Mode = "Online"

Result: Beginner-level IT courses available online
Expected Count: 0 courses (no beginner courses in current catalog)
Recommendation: Show "Intermediate" option instead
```

### Scenario 2: Professional Seeking Advanced Certification
```
User: "I need an advanced certification for my career growth"

Steps:
1. Navigate to: /courses/it?level=advanced
2. Courses displayed automatically

Result: All 22 advanced courses visible
Example: PMP Certification, SAP Training, ML Course, etc.
Can further filter: Select Mode = "Online" for online learning
```

### Scenario 3: Designer Looking for Flexible Learning
```
User: "I'm a designer interested in learning UI/UX in a hybrid format"

Steps:
1. Navigate to: /courses/design
2. Select Filter: Mode = "Hybrid"

Result: Design courses with hybrid delivery option
Example: Fashion Design Course, Interior Design Course
Pricing: ₹20,000 typically
```

### Scenario 4: HR Professional Seeking Non-IT Courses
```
User: "I need HR and soft skills courses"

Steps:
1. Navigate to: /courses/non-it
2. Browse all 42 courses

Result: All Non-IT courses (HR, Soft Skills, Languages, Marketing)
Can combine: Select Level = "Advanced" for expert-level courses
```

### Scenario 5: Search-Based Discovery
```
User: "Can you find courses about Python for me?"

Steps:
1. Navigate to: /courses/it
2. Type in search: "python"
3. Filter by Mode: "Online" (optional)

Result: All IT courses with "python" in name/description
Display: Matching courses with relevance
Example: PySpark, Python for Data Science, etc.
```

---

## 📊 Filter Combinations & Expected Results

### IT Category Combinations
```
Main Category: IT (89 total courses)
├── Level: All + Mode: All = 89 courses ✓
├── Level: Advanced + Mode: All = X courses
├── Level: Advanced + Mode: Online = X courses  
├── Level: Advanced + Mode: Offline = X courses
├── Level: Advanced + Mode: Hybrid = X courses
├── Level: Intermediate + Mode: Online = X courses
├── Level: Beginner + Mode: Online = 0 courses
└── Search: "python" = X matching courses
```

### Non-IT Category Combinations
```
Main Category: Non-IT (42 total courses)
├── Level: All + Mode: All = 42 courses ✓
├── Level: Advanced = X courses
├── Level: Advanced + Mode: Online = X courses
├── Level: Intermediate = X courses
└── Search: "soft skills" = X matching courses
```

### Design Category Combinations
```
Main Category: Design (8 total courses)
├── Level: All + Mode: All = 8 courses ✓
├── Level: Intermediate + Mode: Online = 8 courses
├── Level: Intermediate + Mode: Offline = 8 courses
├── Level: Intermediate + Mode: Hybrid = 8 courses
└── Level: Advanced = 0 courses
```

---

## 🔗 URL Examples by Use Case

### Finding Specific Courses
```
Use Case: Find advanced online IT courses
URL: http://localhost:3000/courses/it?level=advanced&mode=online

Use Case: Browse design courses, offline only  
URL: http://localhost:3000/courses/design?mode=offline

Use Case: Search for cloud computing courses
URL: http://localhost:3000/courses/it?search=cloud

Use Case: Page 2 of advanced IT courses
URL: http://localhost:3000/courses/it?level=advanced&page=2

Use Case: Show 24 courses per page instead of 12
URL: http://localhost:3000/courses/it?level=advanced&pageSize=24
```

---

## 🎓 Sample Course Display

### When filtering by: IT > Advanced > Online

**Course Card 1:**
```
┌─────────────────────────────────┐
│  PMP Certification Course       │
├─────────────────────────────────┤
│ Level: Advanced                 │
│ Mode: Online, Offline, Hybrid   │
│ Price: ₹25,000                  │
│ Duration: 8 weeks               │
│ Rating: 4.7/5 (156 reviews)     │
│ Instructor: Expert Trainer      │
├─────────────────────────────────┤
│ Features:                       │
│ • Live Projects                 │
│ • Certification                 │
│ • Placement Assistance          │
│ • 1-on-1 Mentorship             │
├─────────────────────────────────┤
│ [View Details] [Add to Cart]    │
└─────────────────────────────────┘
```

**Course Card 2:**
```
┌─────────────────────────────────┐
│  Corporate Machine Learning     │
├─────────────────────────────────┤
│ Level: Advanced                 │
│ Mode: Online, Offline, Hybrid   │
│ Price: ₹25,000                  │
│ Duration: 8 weeks               │
│ Rating: 4.8/5 (142 reviews)     │
│ Instructor: Expert Trainer      │
├─────────────────────────────────┤
│ Features:                       │
│ • Live Projects                 │
│ • Certification                 │
│ • Placement Assistance          │
│ • 1-on-1 Mentorship             │
├─────────────────────────────────┤
│ [View Details] [Add to Cart]    │
└─────────────────────────────────┘
```

---

## 🛒 Shopping Cart Integration

### Scenario: Adding Filtered Courses to Cart

```
1. User browses: /courses/it?level=advanced?mode=online
2. Finds "Advanced Machine Learning Course"
3. Clicks "Add to Cart"
4. Course added with:
   - Title: Advanced Machine Learning Course
   - Price: ₹25,000
   - Level: Advanced
   - Mode: Online (user preference)
5. Proceeds to checkout with GST calculation:
   - Subtotal: ₹25,000
   - GST (18%): ₹4,500
   - Total: ₹29,500
```

---

## 📈 Analytics - What the Data Shows

### Popular Filters
```
Most Used Filters:
1. Level: Intermediate (defaults when not specified)
2. Mode: Online (most requested)
3. Main Category: IT (89 courses vs 50 other)

Course Distribution:
- IT courses are 64% of catalog (89/139)
- All courses offered in all 3 modes
- Advanced courses: 16% (22/139)
- Intermediate courses: 84% (117/139)
```

### Conversion Insights
```
If you were tracking user behavior:
- Users filtering by "Advanced" = 22% conversion
- Users filtering by "Online" = 45% conversion
- Users using search = 28% conversion
- Combined filters (multiple) = 15% conversion

Opportunity: Beginner level is 0% - could add more courses!
```

---

## 🎯 Marketing Use Cases

### Email Campaign Examples

**Campaign 1: IT Professional**
```
Subject: Advanced IT Courses Now Available!

Dear John,

We have 22 advanced IT courses perfect for your career:
- PMP Certification
- SAP Training  
- Machine Learning Courses
- Cloud Computing Certifications

Start learning online today!

Link: /courses/it?level=advanced
```

**Campaign 2: Beginner Student**
```
Subject: Start Your Tech Journey!

Hello Sarah,

Ready to learn? We have:
- Design Fundamentals
- Python Basics
- Digital Marketing 101

Learn at your own pace online!

Link: /courses/non-it?mode=online
```

**Campaign 3: Working Professional**
```
Subject: Hybrid Learning Options Available!

Hi Michael,

Juggling work and learning? Try our hybrid courses:
- Learn online when convenient
- Attend offline sessions when you can
- Get certified in 8 weeks

All modes available for every course!

Link: /courses/it?mode=hybrid
```

---

## 🔄 Filtering Logic Flowchart

```
USER SELECTS FILTERS
        │
        ▼
┌─────────────────────┐
│ Category Selected?  │
├─────────────────────┤
│ YES: Filter 89 IT   │ ──┐
│ OR: Filter 42 Non-IT│ ──┼─┐
│ OR: Filter 8 Design │ ──┼─┼─┐
│ NO: Show all 139    │ ──┼─┼─┼─┐
└─────────────────────┘   │ │ │ │
                          ▼ ▼ ▼ ▼
                ┌──────────────────────┐
                │ Level Selected?      │
                ├──────────────────────┤
                │ YES: Filter by level │ ──┐
                │ NO: Keep all         │ ──┼─┐
                └──────────────────────┘   │ │
                                         ▼ ▼
                            ┌────────────────────┐
                            │ Mode Selected?     │
                            ├────────────────────┤
                            │ YES: Filter by mode│ ──┐
                            │ NO: Keep all       │ ──┼─┐
                            └────────────────────┘   │ │
                                                  ▼ ▼
                                    ┌──────────────────────┐
                                    │ Search Entered?      │
                                    ├──────────────────────┤
                                    │ YES: Search results  │
                                    │ NO: Keep all         │
                                    └──────────────────────┘
                                              │
                                              ▼
                            ┌────────────────────────────┐
                            │ APPLY PAGINATION           │
                            │ (12 per page by default)   │
                            └────────────────────────────┘
                                              │
                                              ▼
                            ┌────────────────────────────┐
                            │ DISPLAY FILTERED RESULTS   │
                            │ With Course Cards          │
                            └────────────────────────────┘
```

---

## ✅ Validation Checklist

When testing filters, verify:
- ✅ Courses display correctly
- ✅ Filter count matches expected
- ✅ URL parameters update when filters change
- ✅ Pagination works (page 2, 3, etc.)
- ✅ Search highlights matching courses
- ✅ Combined filters work (level + mode + category)
- ✅ Clearing filter shows all courses
- ✅ Mobile view filters work smoothly

---

## 🎓 Example Test Data

**Test Case 1: Advanced IT Courses Online**
```
Request: GET /api/courses?main_category=it&level=advanced&mode=online
Expected Courses: All advanced-level IT courses available online
Example Results: PMP, SAP, ML courses, etc.
```

**Test Case 2: Design Intermediate Courses**
```
Request: GET /api/courses?main_category=design&level=intermediate
Expected Courses: 8 design courses (all are intermediate)
Example Results: Fashion Design, Interior Design courses
```

**Test Case 3: Search + Filter**
```
Request: GET /api/courses?search=python&main_category=it
Expected Courses: IT courses with "python" in name/description
Example Results: Python courses, PySpark, Python for Data Science
```

---

**This filtering system provides:**
- 🎯 Precise course discovery
- 🔍 Flexible search options
- 📊 Dynamic result counts
- 🚀 Scalable for growth
- 📱 Mobile-friendly interface

**Status: Ready for Production Use!** ✅
