import json

# Load formatted courses
with open('formatted_courses.json', 'r', encoding='utf-8') as f:
    courses = json.load(f)

# Generate JavaScript array
js_code = "const ALL_COURSES = " + json.dumps(courses, indent=2, ensure_ascii=False) + ";\n\nmodule.exports = ALL_COURSES;"

# Save to file
with open('courses_data.js', 'w', encoding='utf-8') as f:
    f.write(js_code)

print(f"✅ Generated courses_data.js with {len(courses)} courses")
print(f"File size: {len(js_code)} bytes")
