import json
import random

json_path = r"c:\Users\a160071\OneDrive - AmerisourceBergen(ABC)\Documents\Workspace\Trainerment\courses_data.json"
with open(json_path, 'r') as f:
    courses = json.load(f)

category_id_map = {'Corporate': 1, 'Technical': 2, 'Non-Technical': 3}

mentors = ['Dr. Priya Sharma', 'Rajesh Kumar', 'Anita Desai', 'Vikram Patel', 
           'Sneha Gupta', 'Amit Singh', 'Kavita Reddy', 'Suresh Nair',
           'Deepa Iyer', 'Rohit Verma', 'Meera Joshi', 'Arjun Menon']

backend_courses = []
for i, course in enumerate(courses):
    main_cat = course['main_category']
    cat_id = category_id_map.get(main_cat, 2)
    
    # Parse features from key_features string or list
    features_raw = course.get('key_features', '')
    if isinstance(features_raw, list):
        features = features_raw[:6]
    elif features_raw:
        features = [f.strip() for f in features_raw.split(',') if f.strip()][:6]
    else:
        features = [
            'Live Project Training',
            'Certification',
            'Placement Assistance',
            '1-on-1 Mentorship',
            'Class Recordings',
            'EMI Options'
        ]
    
    backend_course = {
        'id': course['id'],
        'title': course['name'],
        'slug': course['slug'],
        'category_id': cat_id,
        'category_name': course['category'],
        'main_category': course['main_category'].lower(),
        'price': course['price'],
        'currency': 'INR',
        'duration': course.get('duration', '8-12 weeks'),
        'level': course['level'].lower(),
        'modes': course['modes'],
        'mode': 'hybrid',
        'rating': round(random.uniform(4.2, 4.9), 1),
        'review_count': random.randint(50, 500),
        'mentor_name': mentors[i % len(mentors)],
        'mentor_expertise': f'{course["category"]} Expert',
        'description': course['description'],
        'features': features,
        'modules': [
            {'title': f'Module 1: {course["name"]} Fundamentals', 'topics': 8},
            {'title': 'Module 2: Core Concepts & Theory', 'topics': 10},
            {'title': 'Module 3: Practical Applications', 'topics': 12},
            {'title': 'Module 4: Advanced Topics & Projects', 'topics': 8},
            {'title': 'Module 5: Interview Prep & Certification', 'topics': 6}
        ],
        'certification': course['certification'],
        'batch_options': course['batch_options'],
        'locations': course['locations'],
        'url': course.get('url', ''),
        'thumbnail': course['thumbnail'],
        'is_featured': i < 12 or random.random() < 0.1
    }
    backend_courses.append(backend_course)

js_code = 'const ALL_COURSES = ' + json.dumps(backend_courses, indent=2) + ';\n\nmodule.exports = ALL_COURSES;'
output_path = r"c:\Users\a160071\OneDrive - AmerisourceBergen(ABC)\Documents\Workspace\Trainerment\courses_data.js"
with open(output_path, 'w') as f:
    f.write(js_code)

from collections import Counter
levels = Counter(c['level'] for c in backend_courses)
cats = Counter(c['main_category'] for c in backend_courses)
print(f"[OK] Regenerated courses_data.js with {len(backend_courses)} courses")
print(f"\nBy level: {dict(levels)}")
print(f"By category: {dict(cats)}")
