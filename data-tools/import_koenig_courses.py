"""
Koenig Solutions Course Migration Script
Extracts ~504 courses from koenig-solutions.com sitemap,
classifies them using 40 categories, assigns levels/pricing/duration,
deduplicates against existing catalog, and inserts into courses_data.json.
"""

import urllib.request
import ssl
import re
import json
import os

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
from difflib import SequenceMatcher

# ============================================================
# CONFIGURATION
# ============================================================

# 40 Category Rules with keyword triggers (priority order)
CATEGORY_RULES = [
    {"num": 1, "name": "Cloud Computing & AWS", "type": "IT", "target": 40,
     "keywords": ["aws", "amazon web services", "lambda", "s3", "ec2", "cloudformation", "sagemaker", "redshift", "dynamodb", "aws certified"]},
    {"num": 2, "name": "Cloud & Networking", "type": "IT", "target": 57,
     "keywords": ["ccna", "ccnp", "ccie", "cisco", "juniper", "network", "palo alto", "f5", "sd-wan", "fortinet", "aruba", "routing", "switching", "firewall"]},
    {"num": 3, "name": "Cloud & SaaS Platforms", "type": "IT", "target": 12,
     "keywords": ["google cloud", "gcp", "alibaba cloud", "ibm cloud", "snowflake", "databricks", "salesforce cloud"]},
    {"num": 4, "name": "Data Science & AI", "type": "IT", "target": 49,
     "keywords": ["ai", "artificial intelligence", "machine learning", "ml", "deep learning", "nlp", "tensorflow", "pytorch", "data science", "genai", "llm", "gpt", "computer vision", "neural"]},
    {"num": 5, "name": "Software Development", "type": "IT", "target": 57,
     "keywords": ["python", "java", "c#", "c++", "golang", "go lang", "rust", "scala", "ruby", "perl", "swift", "kotlin", "programming", "developer", ".net", "spring", "microservices"]},
    {"num": 6, "name": "Analytics & Tools", "type": "IT", "target": 36,
     "keywords": ["power bi", "tableau", "excel", "analytics", "data visualization", "qlik", "looker", "splunk", "sas", "business intelligence", "bi"]},
    {"num": 7, "name": "Cyber Security", "type": "IT", "target": 27,
     "keywords": ["ceh", "cissp", "cism", "security", "ethical hacking", "penetration", "soc", "cyber", "oscp", "forensic", "incident response", "threat"]},
    {"num": 8, "name": "DevOps & Automation", "type": "IT", "target": 20,
     "keywords": ["devops", "jenkins", "docker", "kubernetes", "k8s", "terraform", "ansible", "puppet", "chef", "ci/cd", "gitlab", "container", "helm"]},
    {"num": 9, "name": "SAP", "type": "IT", "target": 31,
     "keywords": ["sap", "s/4hana", "s4hana", "abap", "fiori", "hana"]},
    {"num": 10, "name": "Oracle", "type": "IT", "target": 18,
     "keywords": ["oracle", "pl/sql", "oci", "oracle cloud", "oracle database", "oracle fusion"]},
    {"num": 11, "name": "Microsoft 365 & Office", "type": "IT", "target": 20,
     "keywords": ["microsoft 365", "office 365", "ms-700", "ms-900", "ms-100", "exchange", "sharepoint", "teams admin", "outlook", "microsoft office"]},
    {"num": 12, "name": "Microsoft Power Platform", "type": "IT", "target": 16,
     "keywords": ["power platform", "power apps", "power automate", "power virtual", "pl-100", "pl-200", "pl-300", "pl-400", "pl-500", "pl-600", "pl-900"]},
    {"num": 13, "name": "Database Administration", "type": "IT", "target": 19,
     "keywords": ["sql server", "mysql", "postgresql", "mongodb", "database", "dba", "mariadb", "nosql", "cosmos db", "redis", "cassandra", "db2"]},
    {"num": 14, "name": "Virtualization & Infrastructure", "type": "IT", "target": 18,
     "keywords": ["vmware", "vsphere", "hyper-v", "citrix", "nutanix", "virtualization", "vsan", "nsx", "vcenter", "esxi"]},
    {"num": 15, "name": "IT Service Management", "type": "IT", "target": 16,
     "keywords": ["itil", "servicenow", "itsm", "service management", "cobit", "togaf", "enterprise architecture"]},
    {"num": 16, "name": "CRM & ERP", "type": "IT", "target": 21,
     "keywords": ["salesforce", "dynamics 365", "crm", "erp", "hubspot", "zoho", "siebel", "netsuite"]},
    {"num": 17, "name": "Full Stack & Web Development", "type": "IT", "target": 12,
     "keywords": ["full stack", "react", "angular", "node.js", "vue", "html", "css", "javascript", "typescript", "frontend", "backend", "web development", "mern", "mean"]},
    {"num": 18, "name": "Mobile App Development", "type": "IT", "target": 13,
     "keywords": ["android", "ios", "flutter", "react native", "mobile", "xamarin", "ionic", "app development"]},
    {"num": 19, "name": "Software Testing & QA", "type": "IT", "target": 10,
     "keywords": ["selenium", "testing", "qa", "quality assurance", "automation testing", "jmeter", "appium", "cypress", "test automation", "istqb"]},
    {"num": 20, "name": "RPA & Automation", "type": "IT", "target": 4,
     "keywords": ["rpa", "uipath", "blue prism", "automation anywhere", "robotic process"]},
    {"num": 21, "name": "Big Data & Hadoop", "type": "IT", "target": 6,
     "keywords": ["hadoop", "spark", "kafka", "big data", "hive", "pig", "hdfs", "mapreduce", "flink"]},
    {"num": 22, "name": "Engineering & CAD/CAM", "type": "IT", "target": 13,
     "keywords": ["autocad", "solidworks", "catia", "revit", "bim", "cad", "cam", "cnc", "3d printing", "ansys", "matlab", "plc", "scada"]},
    {"num": 23, "name": "Emerging Technologies", "type": "IT", "target": 14,
     "keywords": ["blockchain", "iot", "internet of things", "ar", "vr", "metaverse", "quantum", "5g", "edge computing", "web3", "nft"]},
    {"num": 24, "name": "Master Programs", "type": "IT", "target": 9,
     "keywords": ["master program", "bootcamp", "career track", "complete course", "full course", "end to end"]},
    {"num": 25, "name": "Job-Oriented Programs", "type": "IT", "target": 3,
     "keywords": ["job oriented", "placement", "career ready", "job guarantee", "interview prep"]},
    {"num": 26, "name": "Software Testing & Others", "type": "IT", "target": 3,
     "keywords": ["manual testing", "load testing", "performance testing", "api testing"]},
    {"num": 27, "name": "Digital Marketing", "type": "Non-IT", "target": 13,
     "keywords": ["digital marketing", "seo", "sem", "social media", "google ads", "content marketing", "email marketing", "ppc", "affiliate"]},
    {"num": 28, "name": "Design", "type": "Non-IT", "target": 27,
     "keywords": ["graphic design", "ui/ux", "ux design", "photoshop", "illustrator", "figma", "sketch", "indesign", "after effects", "premiere", "video editing", "animation", "3ds max", "maya"]},
    {"num": 29, "name": "HR & Management", "type": "Non-IT", "target": 20,
     "keywords": ["hr", "human resource", "talent", "recruitment", "performance management", "organizational", "management"]},
    {"num": 30, "name": "HR & Finance", "type": "Non-IT", "target": 3,
     "keywords": ["payroll", "compensation", "benefits administration", "hr analytics"]},
    {"num": 31, "name": "Finance & Accounting", "type": "Non-IT", "target": 14,
     "keywords": ["finance", "accounting", "cfa", "acca", "ifrs", "financial modeling", "investment", "banking", "tax", "audit", "bookkeeping"]},
    {"num": 32, "name": "Language & Soft Skills", "type": "Non-IT", "target": 17,
     "keywords": ["english", "communication", "presentation", "public speaking", "business writing", "french", "german", "spanish", "japanese", "language"]},
    {"num": 33, "name": "Leadership & Soft Skills", "type": "Non-IT", "target": 15,
     "keywords": ["leadership", "negotiation", "conflict resolution", "emotional intelligence", "team building", "coaching", "mentoring", "executive"]},
    {"num": 34, "name": "Supply Chain & Logistics", "type": "Non-IT", "target": 12,
     "keywords": ["supply chain", "logistics", "procurement", "inventory", "warehouse", "transportation", "scm", "demand planning", "apics"]},
    {"num": 35, "name": "Healthcare & Safety", "type": "Non-IT", "target": 10,
     "keywords": ["healthcare", "medical", "patient safety", "clinical", "nebosh", "osha", "safety", "first aid", "health"]},
    {"num": 36, "name": "Oil Gas & Energy", "type": "Non-IT", "target": 10,
     "keywords": ["oil", "gas", "energy", "petroleum", "drilling", "pipeline", "renewable", "solar", "wind", "power plant"]},
    {"num": 37, "name": "Career Development", "type": "Non-IT", "target": 2,
     "keywords": ["career development", "resume", "interview skills", "personal branding"]},
    {"num": 38, "name": "Project Management & Certifications", "type": "Corporate", "target": 35,
     "keywords": ["pmp", "prince2", "project management", "agile", "scrum", "safe", "kanban", "lean", "six sigma", "pmi", "capm", "msproject"]},
    {"num": 39, "name": "ISO & Compliance", "type": "Corporate", "target": 14,
     "keywords": ["iso", "compliance", "gdpr", "sox", "regulatory", "audit", "governance", "risk management", "coso"]},
    {"num": 40, "name": "Quality Management", "type": "Corporate", "target": 11,
     "keywords": ["quality", "tqm", "kaizen", "cmmi", "lean manufacturing", "process improvement", "bpm"]},
]

# Level rules with keyword triggers
LEVEL_RULES = [
    {"level": "Advanced", "keywords": ["advanced", "expert level", "architect professional", "ccie", "ccde", "senior", "principal", "black belt", "professional level", "expert"]},
    {"level": "Beginner", "keywords": ["introduction", "fundamentals", "foundation", "basics", "getting started", "essentials", "entry level", "digital leader", "beginner"]},
    {"level": "Intermediate to Advanced", "keywords": ["professional", "specialist", "solutions architect", "security ops", "associate to professional"]},
    {"level": "Beginner to Advanced", "keywords": ["bootcamp", "career track", "end-to-end", "complete", "master program", "full course"]},
    {"level": "Intermediate", "keywords": ["associate", "practitioner", "administrator", "developer certified", "intermediate"]},
    {"level": "Beginner to Intermediate", "keywords": ["cloud practitioner", "az-900", "ai-900", "dp-900", "sc-900", "ms-900", "pl-900"]},
    {"level": "All Levels", "keywords": []},  # Default
]

# Duration rules by category group and level
DURATION_RULES = {
    "cloud_networking": {"Beginner": "20 Hours", "Beginner to Intermediate": "24 Hours", "Intermediate": "32 Hours", "Intermediate to Advanced": "36 Hours", "Advanced": "40 Hours", "Beginner to Advanced": "60 Hours", "All Levels": "30 Hours"},
    "programming": {"Beginner": "30 Hours", "Beginner to Intermediate": "35 Hours", "Intermediate": "50 Hours", "Intermediate to Advanced": "60 Hours", "Advanced": "70 Hours", "Beginner to Advanced": "80 Hours", "All Levels": "45 Hours"},
    "data_science": {"Beginner": "40 Hours", "Beginner to Intermediate": "45 Hours", "Intermediate": "50 Hours", "Intermediate to Advanced": "60 Hours", "Advanced": "100 Hours", "Beginner to Advanced": "120 Hours", "All Levels": "50 Hours"},
    "cyber_security": {"Beginner": "30 Hours", "Beginner to Intermediate": "35 Hours", "Intermediate": "36 Hours", "Intermediate to Advanced": "40 Hours", "Advanced": "50 Hours", "Beginner to Advanced": "60 Hours", "All Levels": "35 Hours"},
    "sap_oracle": {"Beginner": "24 Hours", "Beginner to Intermediate": "30 Hours", "Intermediate": "35 Hours", "Intermediate to Advanced": "40 Hours", "Advanced": "45 Hours", "Beginner to Advanced": "60 Hours", "All Levels": "35 Hours"},
    "devops": {"Beginner": "20 Hours", "Beginner to Intermediate": "25 Hours", "Intermediate": "30 Hours", "Intermediate to Advanced": "35 Hours", "Advanced": "40 Hours", "Beginner to Advanced": "50 Hours", "All Levels": "30 Hours"},
    "microsoft": {"Beginner": "16 Hours", "Beginner to Intermediate": "20 Hours", "Intermediate": "24 Hours", "Intermediate to Advanced": "30 Hours", "Advanced": "32 Hours", "Beginner to Advanced": "40 Hours", "All Levels": "24 Hours"},
    "management": {"Beginner": "16 Hours", "Beginner to Intermediate": "20 Hours", "Intermediate": "24 Hours", "Intermediate to Advanced": "30 Hours", "Advanced": "35 Hours", "Beginner to Advanced": "40 Hours", "All Levels": "24 Hours"},
    "design": {"Beginner": "25 Hours", "Beginner to Intermediate": "30 Hours", "Intermediate": "40 Hours", "Intermediate to Advanced": "50 Hours", "Advanced": "60 Hours", "Beginner to Advanced": "80 Hours", "All Levels": "35 Hours"},
    "default": {"Beginner": "24 Hours", "Beginner to Intermediate": "28 Hours", "Intermediate": "32 Hours", "Intermediate to Advanced": "36 Hours", "Advanced": "40 Hours", "Beginner to Advanced": "60 Hours", "All Levels": "30 Hours"},
}

# Map categories to duration groups
CATEGORY_DURATION_MAP = {
    "Cloud Computing & AWS": "cloud_networking",
    "Cloud & Networking": "cloud_networking",
    "Cloud & SaaS Platforms": "cloud_networking",
    "Data Science & AI": "data_science",
    "Software Development": "programming",
    "Analytics & Tools": "programming",
    "Cyber Security": "cyber_security",
    "DevOps & Automation": "devops",
    "SAP": "sap_oracle",
    "Oracle": "sap_oracle",
    "Microsoft 365 & Office": "microsoft",
    "Microsoft Power Platform": "microsoft",
    "Database Administration": "programming",
    "Virtualization & Infrastructure": "cloud_networking",
    "IT Service Management": "management",
    "CRM & ERP": "sap_oracle",
    "Full Stack & Web Development": "programming",
    "Mobile App Development": "programming",
    "Software Testing & QA": "programming",
    "RPA & Automation": "devops",
    "Big Data & Hadoop": "data_science",
    "Engineering & CAD/CAM": "design",
    "Emerging Technologies": "programming",
    "Master Programs": "data_science",
    "Job-Oriented Programs": "programming",
    "Software Testing & Others": "programming",
    "Digital Marketing": "management",
    "Design": "design",
    "HR & Management": "management",
    "HR & Finance": "management",
    "Finance & Accounting": "management",
    "Language & Soft Skills": "management",
    "Leadership & Soft Skills": "management",
    "Supply Chain & Logistics": "management",
    "Healthcare & Safety": "management",
    "Oil Gas & Energy": "management",
    "Career Development": "management",
    "Project Management & Certifications": "management",
    "ISO & Compliance": "management",
    "Quality Management": "management",
}

# Main category mapping
TYPE_TO_MAIN_CATEGORY = {
    "IT": "Technical",
    "Non-IT": "Non-Technical",
    "Corporate": "Corporate",
}

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def slug_to_title(slug):
    """Convert URL slug to proper course title."""
    # Remove common suffixes
    slug = re.sub(r'-training-certification$', '', slug)
    slug = re.sub(r'-training-course$', '', slug)
    slug = re.sub(r'-certification-training$', '', slug)
    slug = re.sub(r'-training$', '', slug)
    slug = re.sub(r'-certification$', '', slug)
    slug = re.sub(r'-course$', '', slug)
    # Remove leading course codes (numbers)
    slug = re.sub(r'^\d+[a-z]?-', '', slug)
    # Convert hyphens to spaces
    title = slug.replace('-', ' ').strip()
    # Title case with acronym handling
    words = title.split()
    result = []
    # Known acronyms to keep uppercase
    acronyms = {'aws', 'gcp', 'ai', 'ml', 'nlp', 'sql', 'sap', 'erp', 'crm', 'hr',
                'api', 'sdk', 'ci', 'cd', 'iot', 'vr', 'ar', 'nft', 'rpa', 'dba',
                'bi', 'etl', 'seo', 'sem', 'ppc', 'css', 'html', 'xml', 'json',
                'ux', 'ui', 'qa', 'pmp', 'iso', 'gdpr', 'itil', 'togaf', 'ccna',
                'ccnp', 'ccie', 'ceh', 'cissp', 'cism', 'oscp', 'az', 'ms', 'dp',
                'sc', 'pl', 'mb', 'md', 'ai', 'ec2', 's3', 'vpc', 'iam', 'eks',
                'ecs', 'rds', 'sqs', 'sns', 'emr', 'devops', 'vmware', 'nsx',
                'sdn', 'sd', 'wan', 'lan', 'vpn', 'tcp', 'ip', 'dns', 'dhcp',
                'bgp', 'ospf', 'mpls', 'ssl', 'tls', 'ssh', 'ftp', 'http', 'https',
                'php', 'net', 'mvc', 'oop', 'rest', 'soap', 'grpc', 'graphql'}
    for w in words:
        if w.lower() in acronyms:
            result.append(w.upper())
        elif len(w) <= 2:
            result.append(w.upper())
        else:
            result.append(w.capitalize())
    return ' '.join(result)


def classify_category(title):
    """Classify a course into one of 40 categories based on keyword matching."""
    title_lower = title.lower()
    for rule in CATEGORY_RULES:
        for keyword in rule["keywords"]:
            if keyword.lower() in title_lower:
                return rule
    # Default: Software Development for IT-sounding, or general
    return CATEGORY_RULES[4]  # Software Development as default


def classify_level(title):
    """Classify course level based on keyword triggers."""
    title_lower = title.lower()
    for rule in LEVEL_RULES[:-1]:  # Skip "All Levels" default
        for keyword in rule["keywords"]:
            if keyword.lower() in title_lower:
                return rule["level"]
    return "Intermediate"  # Default per error handling rules


def get_duration(category_name, level):
    """Get duration based on category and level."""
    group = CATEGORY_DURATION_MAP.get(category_name, "default")
    durations = DURATION_RULES.get(group, DURATION_RULES["default"])
    return durations.get(level, durations["All Levels"])


def make_slug(title):
    """Generate URL slug from title."""
    slug = title.lower()
    # Remove special characters
    slug = re.sub(r'[().,#&/:;!?@+]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'\s+', '-', slug)
    # Remove double hyphens
    slug = re.sub(r'-+', '-', slug)
    # Trim
    slug = slug.strip('-')
    # Truncate at 100 chars
    if len(slug) > 100:
        slug = slug[:100].rsplit('-', 1)[0]
    return slug


def similarity(a, b):
    """Calculate string similarity ratio."""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def normalize_name(name):
    """Normalize course name for deduplication."""
    name = name.lower()
    # Remove common words
    for word in ['training', 'course', 'certification', 'program', 'tutorial', 'masterclass']:
        name = name.replace(word, '')
    name = re.sub(r'\s+', ' ', name).strip()
    return name


# ============================================================
# MAIN PIPELINE
# ============================================================

def fetch_koenig_courses():
    """Fetch course URLs from Koenig sitemap."""
    print("📡 Fetching Koenig Solutions sitemap...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    req = urllib.request.Request(
        'https://www.koenig-solutions.com/sitemap.xml',
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
    )
    with urllib.request.urlopen(req, timeout=60, context=ctx) as resp:
        content = resp.read().decode('utf-8')
    
    # Extract all URLs
    locs = re.findall(r'<loc>(.*?)</loc>', content)
    base = 'https://www.koenig-solutions.com/'
    
    # Get flexi courses (individual course pages)
    flexi_slugs = []
    for url in locs:
        if '/flexi/' in url:
            slug = url.replace(base + 'flexi/', '')
            if slug and not slug.startswith('.') and not slug.startswith('"'):
                flexi_slugs.append(slug)
    
    print(f"   Found {len(flexi_slugs)} flexi course URLs")
    
    # Also get root-level individual course pages
    root_slugs = []
    for url in locs:
        if url.startswith(base) and url != base:
            path = url[len(base):]
            if '/' not in path and path:
                # Skip category/vendor pages
                if not path.endswith('-training-courses') and not path.endswith('-certification-courses'):
                    if '-training' in path or '-course' in path or '-certification' in path:
                        root_slugs.append(path)
    
    print(f"   Found {len(root_slugs)} root-level course URLs")
    
    # Convert slugs to course names (flexi first, then root for extras)
    courses_raw = {}
    for slug in flexi_slugs:
        name = slug_to_title(slug)
        if len(name) > 5 and name not in courses_raw:
            courses_raw[name] = slug
    
    for slug in root_slugs:
        name = slug_to_title(slug)
        if len(name) > 5 and name not in courses_raw:
            courses_raw[name] = slug
    
    print(f"   Unique course names: {len(courses_raw)}")
    return courses_raw


def select_courses(courses_raw, existing_courses):
    """Select ~504 courses to fill category targets, avoiding duplicates."""
    print("\n🎯 Selecting courses to fill category targets...")
    
    # Get existing course names (normalized) for dedup
    existing_normalized = set()
    for c in existing_courses:
        existing_normalized.add(normalize_name(c.get('name', '')))
    
    # Classify all raw courses
    classified = []
    unmatched = []
    for name, slug in courses_raw.items():
        cat = classify_category(name)
        classified.append({
            'name': name,
            'slug': slug,
            'category': cat['name'],
            'category_type': cat['type'],
            'category_num': cat['num'],
        })
    
    # Count existing courses per category
    existing_by_cat = {}
    for c in existing_courses:
        cat = c.get('category', '')
        existing_by_cat[cat] = existing_by_cat.get(cat, 0) + 1
    
    # Calculate how many Koenig courses needed per category
    needed_per_cat = {}
    for rule in CATEGORY_RULES:
        existing_count = existing_by_cat.get(rule['name'], 0)
        needed = max(0, rule['target'] - existing_count)
        needed_per_cat[rule['name']] = needed
    
    total_needed = sum(needed_per_cat.values())
    print(f"   Total courses needed from Koenig: {total_needed}")
    
    # Select courses per category
    selected = []
    selected_normalized = set()
    
    for rule in CATEGORY_RULES:
        cat_name = rule['name']
        needed = needed_per_cat[cat_name]
        if needed <= 0:
            continue
        
        # Get candidates for this category
        candidates = [c for c in classified if c['category'] == cat_name]
        
        count = 0
        for candidate in candidates:
            if count >= needed:
                break
            
            # Deduplication check
            norm_name = normalize_name(candidate['name'])
            
            # Check against existing
            is_dup = False
            for existing_name in existing_normalized:
                if similarity(norm_name, existing_name) > 0.85:
                    is_dup = True
                    break
            
            # Check against already selected
            if not is_dup:
                for sel_name in selected_normalized:
                    if similarity(norm_name, sel_name) > 0.85:
                        is_dup = True
                        break
            
            if not is_dup:
                selected.append(candidate)
                selected_normalized.add(norm_name)
                count += 1
        
        shortfall = needed - count
        if shortfall > 0:
            print(f"   ⚠️  {cat_name}: filled {count}/{needed} (short by {shortfall})")
    
    # If we're still short of 504, fill remaining from unselected courses
    target_total = 504
    if len(selected) < target_total:
        remaining_needed = target_total - len(selected)
        print(f"\n   Filling {remaining_needed} more courses from available pool...")
        
        # Get all unselected courses
        selected_names = {c['name'] for c in selected}
        available = [c for c in classified if c['name'] not in selected_names]
        
        added = 0
        for candidate in available:
            if added >= remaining_needed:
                break
            norm_name = normalize_name(candidate['name'])
            is_dup = False
            for existing_name in existing_normalized:
                if similarity(norm_name, existing_name) > 0.85:
                    is_dup = True
                    break
            if not is_dup:
                for sel_name in selected_normalized:
                    if similarity(norm_name, sel_name) > 0.85:
                        is_dup = True
                        break
            if not is_dup:
                selected.append(candidate)
                selected_normalized.add(norm_name)
                added += 1
    
    print(f"   Selected {len(selected)} courses after deduplication")
    return selected


def build_course_records(selected_courses, start_id):
    """Build full course records with all fields."""
    print("\n📝 Building course records...")
    
    records = []
    for i, course in enumerate(selected_courses):
        name = course['name']
        category = course['category']
        cat_type = course['category_type']
        main_category = TYPE_TO_MAIN_CATEGORY[cat_type]
        
        level = classify_level(name)
        duration = get_duration(category, level)
        slug = make_slug(name)
        
        record = {
            "id": start_id + i,
            "name": name,
            "slug": slug,
            "category": category,
            "main_category": main_category,
            "level": level.lower().replace(' ', '-'),  # e.g., "intermediate-to-advanced"
            "modes": ["Online", "Classroom", "1-on-1", "Fly-Me-A-Trainer"],
            "price": "Contact for Pricing",
            "duration": duration,
            "description": f"Comprehensive {name} training program by TrainerMentors. This course covers all essential topics with hands-on labs, real-world projects, and industry-recognized certification preparation. Suitable for {level.lower()} level professionals.",
            "certification": "Yes - Industry Recognized",
            "batch_options": ["Weekday", "Weekend", "Flexible Schedule"],
            "locations": ["Delhi", "Bangalore", "Goa", "Dubai", "Online (Global)"],
            "key_features": [
                "Live Instructor-Led Training",
                "Hands-on Labs & Projects",
                "Industry-Recognized Certification",
                "24/7 Learning Support",
                "Post-Training Job Assistance",
                "Flexible Batch Timings"
            ],
            "url": f"https://trainermentors.com/{slug}",
            "source": "Koenig Solutions",
            "thumbnail": ""
        }
        records.append(record)
    
    print(f"   Built {len(records)} course records")
    return records


def main():
    print("=" * 60)
    print("🚀 KOENIG SOLUTIONS COURSE MIGRATION")
    print("=" * 60)
    
    # Step 1: Fetch courses from sitemap
    courses_raw = fetch_koenig_courses()
    
    # Step 2: Load existing courses
    print("\n📂 Loading existing courses...")
    with open(os.path.join(ROOT, 'courses_data.json'), 'r', encoding='utf-8') as f:
        existing_courses = json.load(f)
    print(f"   Existing courses: {len(existing_courses)}")
    
    # Step 3: Select and deduplicate
    selected = select_courses(courses_raw, existing_courses)
    
    # Step 4: Build full records
    start_id = len(existing_courses) + 1
    new_records = build_course_records(selected, start_id)
    
    # Step 5: Merge and save
    print("\n💾 Saving updated catalog...")
    all_courses = existing_courses + new_records
    
    with open(os.path.join(ROOT, 'courses_data.json'), 'w', encoding='utf-8') as f:
        json.dump(all_courses, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'=' * 60}")
    print(f"✅ MIGRATION COMPLETE!")
    print(f"{'=' * 60}")
    print(f"   Previous courses: {len(existing_courses)}")
    print(f"   New Koenig courses: {len(new_records)}")
    print(f"   Total courses: {len(all_courses)}")
    
    # Stats
    print(f"\n📊 By Main Category:")
    by_main = {}
    for c in all_courses:
        mc = c.get('main_category', 'Unknown')
        by_main[mc] = by_main.get(mc, 0) + 1
    for k, v in sorted(by_main.items()):
        print(f"   {k}: {v}")
    
    print(f"\n📊 By Sub-Category (top 20):")
    by_cat = {}
    for c in all_courses:
        cat = c.get('category', 'Unknown')
        by_cat[cat] = by_cat.get(cat, 0) + 1
    for k, v in sorted(by_cat.items(), key=lambda x: -x[1])[:20]:
        print(f"   {k}: {v}")
    
    print(f"\n📊 By Level:")
    by_level = {}
    for c in all_courses:
        lvl = c.get('level', 'unknown')
        by_level[lvl] = by_level.get(lvl, 0) + 1
    for k, v in sorted(by_level.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}")
    
    print(f"\n📊 By Source:")
    by_source = {}
    for c in all_courses:
        src = c.get('source', 'Unknown')
        by_source[src] = by_source.get(src, 0) + 1
    for k, v in sorted(by_source.items(), key=lambda x: -x[1]):
        print(f"   {k}: {v}")


if __name__ == '__main__':
    main()

