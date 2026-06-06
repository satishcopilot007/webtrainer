import json

# Load formatted courses
with open('formatted_courses.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Print statistics
print(f"✅ Total courses: {len(courses)}")
print(f"📊 Price range: ₹{min(c['price'] for c in courses)} - ₹{max(c['price'] for c in courses)}")
print(f"⏱️  Duration range: {min(c['duration_weeks'] for c in courses)}-{max(c['duration_weeks'] for c in courses)} weeks")
print()

# Category count
categories = {}
for course in courses:
    cat = course['category_name']
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(course)

print("📚 Courses by Category:")
for cat_id in sorted(set(c['category_id'] for c in courses)):
    cat_courses = [c for c in courses if c['category_id'] == cat_id]
    cat_name = cat_courses[0]['category_name']
    print(f"  {cat_id}. {cat_name}: {len(cat_courses)} courses")

print(f"\n✅ Ready to update API with {len(courses)} courses")
