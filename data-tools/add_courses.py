import json, re

json_path = r"c:\Users\a160071\OneDrive - AmerisourceBergen(ABC)\Documents\Workspace\Trainerment\courses_data.json"
with open(json_path, 'r') as f:
    courses = json.load(f)

max_id = max(c['id'] for c in courses)

def make_slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def c(name, cat, main_cat, level, price, dur, desc, cert):
    return {"name":name,"category":cat,"main_category":main_cat,"level":level,"price":price,"duration":dur,"description":desc,"certification":cert}

new_courses = [
  # ── IT: Java ──
  c("Java Programming for Beginners","Programming","IT","Beginner",9999,"8 weeks","Start programming with Java. Covers syntax, variables, control flow, OOP fundamentals and building console applications from scratch with hands-on lab exercises.","Java Beginner Certificate"),
  c("Core Java and Advanced Java","Programming","IT","Intermediate",13999,"10 weeks","Deepen your Java skills with collections, generics, multithreading, JDBC, file I/O and Advanced Java web components like Servlets and JSP for dynamic web apps.","Java Developer Certificate"),
  c("Java Full Stack Development","Programming","IT","Advanced",24999,"16 weeks","Build production-grade apps using Spring Boot backend, React frontend, REST APIs, microservices, Docker containers and CI/CD pipeline deployment from scratch.","Java Full Stack Certificate"),

  # ── IT: .NET ──
  c("C Sharp Programming for Beginners","Programming","IT","Beginner",9999,"8 weeks","Learn C# and the .NET ecosystem from ground up. Covers OOP principles, Visual Studio, variables, loops, methods and building Windows console applications.","C Sharp Fundamentals Certificate"),
  c("ASP.NET MVC Web Development","Programming","IT","Intermediate",14999,"12 weeks","Build dynamic web applications with ASP.NET MVC covering routing, controllers, Razor views, Entity Framework, authentication and REST API creation.","ASP.NET Developer Certificate"),
  c("DotNet Core Microservices Architecture","Programming","IT","Advanced",22999,"14 weeks","Design scalable microservices using .NET Core, Azure Service Bus, Docker, Kubernetes, gRPC and Event-Driven Architecture patterns for enterprise systems.","Advanced .NET Certificate"),

  # ── IT: JavaScript / React ──
  c("JavaScript Fundamentals","Web Development","IT","Beginner",8999,"8 weeks","Start web programming with JavaScript. Covers variables, functions, DOM manipulation, events, ES6 syntax, Fetch API and building interactive pages.","JavaScript Essentials Certificate"),
  c("React JS Frontend Development","Web Development","IT","Intermediate",14999,"10 weeks","Build modern web apps with React. Covers components, props, state, hooks, React Router, Redux Toolkit and REST API integration with practical projects.","React Developer Certificate"),
  c("Full Stack MERN Development","Web Development","IT","Advanced",24999,"16 weeks","Become a MERN stack developer building production apps with MongoDB, Express, React and Node.js including JWT auth, payment integration and cloud deployment.","MERN Full Stack Certificate"),

  # ── IT: SQL / Database ──
  c("SQL and Database Design Basics","Database","IT","Beginner",7999,"6 weeks","Learn relational databases and SQL from scratch covering SELECT, INSERT, UPDATE, DELETE, JOINs, GROUP BY, subqueries and MySQL Workbench hands-on practice.","SQL Essentials Certificate"),
  c("Advanced SQL and Database Management","Database","IT","Intermediate",11999,"8 weeks","Master stored procedures, triggers, query optimization, indexing strategies, normalization, transactions and database administration for MySQL and MS SQL Server.","Advanced SQL Certificate"),
  c("NoSQL with MongoDB","Database","IT","Intermediate",10999,"8 weeks","Work with document databases using MongoDB covering CRUD, aggregation pipeline, indexing, schema design, replication, sharding and Atlas cloud integration.","MongoDB Developer Certificate"),

  # ── IT: Testing ──
  c("Manual Software Testing Foundations","Software Testing","IT","Beginner",8999,"8 weeks","Build QA fundamentals covering SDLC and STLC, test case design, defect lifecycle, Agile testing, JIRA bug tracking and real-project test execution.","Manual Testing Certificate"),
  c("Selenium Automation Testing","Software Testing","IT","Intermediate",14999,"10 weeks","Automate web testing with Selenium WebDriver and Java covering TestNG, Page Object Model, data-driven testing, Maven and Jenkins CI integration.","Selenium Automation Certificate"),
  c("API Testing with Postman and REST Assured","Software Testing","IT","Intermediate",11999,"8 weeks","Master REST API testing using Postman collections and REST Assured framework covering authentication, validation, negative testing and CI pipeline integration.","API Testing Certificate"),
  c("Performance Testing with JMeter","Software Testing","IT","Advanced",13999,"8 weeks","Conduct load, stress and endurance testing using Apache JMeter covering thread groups, assertions, distributed testing, result analysis and CI integration.","Performance Testing Certificate"),

  # ── IT: AWS ──
  c("AWS Cloud Practitioner","Cloud Computing","IT","Beginner",11999,"8 weeks","Begin your cloud journey covering AWS core services, EC2, S3, RDS, IAM, VPC, pricing models and preparation for the AWS Cloud Practitioner certification exam.","AWS Cloud Practitioner Certificate"),
  c("AWS Solutions Architect Associate","Cloud Computing","IT","Intermediate",18999,"12 weeks","Design resilient AWS architectures covering EC2, ELB, Auto Scaling, S3, CloudFront, RDS, DynamoDB, Lambda, SQS and SAA-C03 exam preparation.","AWS Solutions Architect Certificate"),
  c("AWS DevOps Engineer Professional","Cloud Computing","IT","Advanced",24999,"14 weeks","Automate AWS infrastructure covering CodePipeline, CodeBuild, CodeDeploy, CloudFormation, Terraform, ECS, EKS, CloudWatch monitoring and DOP-C02 exam prep.","AWS DevOps Professional Certificate"),

  # ── IT: Azure ──
  c("Microsoft Azure Fundamentals AZ900","Cloud Computing","IT","Beginner",11999,"8 weeks","Build Azure foundations covering cloud concepts, core services, storage, networking, security, compliance, Azure pricing and AZ-900 certification preparation.","Azure Fundamentals Certificate"),
  c("Microsoft Azure Administrator AZ104","Cloud Computing","IT","Intermediate",18999,"12 weeks","Administer Azure subscriptions covering Azure AD, virtual machines, networking, storage, backup, monitoring, governance and AZ-104 exam preparation.","Azure Administrator Certificate"),

  # ── IT: DevOps ──
  c("DevOps with Jenkins Docker and Kubernetes","DevOps","IT","Advanced",22999,"14 weeks","Build complete DevOps pipelines covering Git, Jenkins, Maven, Docker, Kubernetes, Ansible, Terraform, Prometheus monitoring and GitOps workflows.","DevOps Engineer Certificate"),
  c("Linux Administration and Shell Scripting","DevOps","IT","Intermediate",10999,"8 weeks","Master Linux system administration covering file systems, user management, networking, package management, Bash scripting, cron jobs and server hardening.","Linux Administration Certificate"),

  # ── IT: Data Science ──
  c("Data Science with Python","Data Science","IT","Intermediate",16999,"12 weeks","Enter data science using Python covering Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, statistical analysis, feature engineering and complete project delivery.","Data Science Professional Certificate"),
  c("Machine Learning Engineering","Data Science","IT","Intermediate",18999,"14 weeks","Implement ML solutions covering supervised and unsupervised learning, regression, classification, clustering, model evaluation, pipelines and deployment using Flask.","Machine Learning Engineer Certificate"),
  c("Deep Learning and AI with TensorFlow","Data Science","IT","Advanced",24999,"16 weeks","Build AI systems using neural networks, CNNs, RNNs, LSTMs, Transformers, NLP, computer vision, model optimization and production deployment strategies.","Deep Learning Engineer Certificate"),
  c("Power BI for Data Analytics","Data Science","IT","Beginner",9999,"8 weeks","Create business intelligence dashboards using Power BI Desktop covering data import, Power Query, DAX formulas, relationships, visualizations and report sharing.","Power BI Analyst Certificate"),
  c("Tableau for Business Intelligence","Data Science","IT","Intermediate",12999,"10 weeks","Build interactive dashboards with Tableau covering calculated fields, LOD expressions, data blending, storytelling, Tableau Server and Prep Builder workflows.","Tableau Specialist Certificate"),
  c("Big Data with Hadoop and Spark","Data Science","IT","Advanced",21999,"14 weeks","Process massive datasets covering Hadoop HDFS, MapReduce, Hive, Pig, Apache Spark, Kafka, HBase, Sqoop and real-time analytics pipeline implementation.","Big Data Engineer Certificate"),

  # ── IT: Cybersecurity ──
  c("Cybersecurity Fundamentals","Cybersecurity","IT","Beginner",10999,"8 weeks","Learn information security foundations covering CIA triad, network threats, firewalls, encryption, phishing awareness, incident response basics and compliance.","Cybersecurity Fundamentals Certificate"),
  c("Ethical Hacking and Penetration Testing","Cybersecurity","IT","Intermediate",17999,"12 weeks","Think like an attacker to defend systems. Covers Kali Linux, reconnaissance, scanning, exploitation, privilege escalation, post-exploitation and ethical hacking methodology.","Ethical Hacking Certificate"),
  c("Certified Ethical Hacker CEH Preparation","Cybersecurity","IT","Advanced",22999,"14 weeks","Intensive CEH prep covering all 20 domains including advanced persistent threats, web application hacking, IoT security, cloud hacking and cryptography.","CEH Preparation Certificate"),

  # ── IT: Mobile ──
  c("Android App Development with Kotlin","Mobile Development","IT","Intermediate",14999,"12 weeks","Build native Android apps using Kotlin covering Android Studio, Activities, Fragments, RecyclerView, Room database, Retrofit, Firebase and Play Store deployment.","Android Developer Certificate"),
  c("Flutter Cross Platform App Development","Mobile Development","IT","Intermediate",14999,"12 weeks","Build iOS and Android apps from one codebase using Flutter covering Dart, widgets, state management, navigation, REST APIs, local storage and app store submission.","Flutter Developer Certificate"),

  # ── Non-IT: Digital Marketing ──
  c("Digital Marketing Fundamentals","Digital Marketing","Non-IT","Beginner",7999,"8 weeks","Launch your digital marketing career covering SEO basics, social media, Google Analytics, email marketing, content strategy and paid advertising fundamentals.","Digital Marketing Fundamentals Certificate"),
  c("SEO and Content Marketing","Digital Marketing","Non-IT","Intermediate",11999,"10 weeks","Drive organic traffic through keyword research, on-page and off-page SEO, technical audits, link building, blog strategy, content calendars and Google Search Console.","SEO Specialist Certificate"),
  c("Social Media Marketing and Management","Digital Marketing","Non-IT","Beginner",8999,"8 weeks","Grow brand presence covering Instagram, Facebook, LinkedIn, YouTube, Twitter strategy, content creation, scheduling tools, influencer marketing and analytics.","Social Media Marketing Certificate"),
  c("Google Ads and PPC Advertising","Digital Marketing","Non-IT","Intermediate",12999,"10 weeks","Run profitable paid campaigns covering Google Search and Display Ads, bidding strategies, Quality Score, remarketing, conversion tracking and ROI optimization.","Google Ads Specialist Certificate"),
  c("Advanced Digital Marketing Strategy","Digital Marketing","Non-IT","Advanced",18999,"12 weeks","Lead digital transformation covering omnichannel strategies, marketing automation, CRM, attribution modeling, growth hacking and digital agency management.","Digital Marketing Strategy Certificate"),

  # ── Non-IT: SAP ──
  c("SAP FICO Functional Consultant","SAP","Non-IT","Intermediate",22999,"14 weeks","Become an SAP FICO consultant covering FI module GL AR AP and asset accounting along with CO module cost centers profit centers and internal order accounting.","SAP FICO Certificate"),
  c("SAP MM Materials Management","SAP","Non-IT","Intermediate",19999,"12 weeks","Master SAP MM covering procurement process, purchase orders, goods receipts, inventory management, vendor evaluation, MRP and integration with FI and SD.","SAP MM Certificate"),
  c("SAP SD Sales and Distribution","SAP","Non-IT","Intermediate",19999,"12 weeks","Configure SAP SD covering sales order processing, pricing, billing, shipping, credit management, availability check and integration with SAP MM and FI modules.","SAP SD Certificate"),
  c("SAP HR HCM Human Capital Management","SAP","Non-IT","Intermediate",19999,"12 weeks","Administer HR processes using SAP HCM covering personnel administration, organizational management, time management, payroll and employee self-service portal.","SAP HCM Certificate"),
  c("SAP S4 HANA Migration and Implementation","SAP","Non-IT","Advanced",28999,"16 weeks","Lead SAP S/4 HANA projects covering Activate methodology, business blueprint, data migration using LSMW, Fiori apps, custom reporting and go-live support.","SAP S/4 HANA Certificate"),

  # ── Non-IT: Business Management ──
  c("Business Analysis Fundamentals","Business Management","Non-IT","Beginner",9999,"8 weeks","Start your BA career covering requirement elicitation, use case writing, process flow diagrams, stakeholder communication, BPMN, wireframing and agile BA practices.","Business Analysis Certificate"),
  c("PMP Project Management Professional","Business Management","Non-IT","Intermediate",18999,"12 weeks","Prepare for PMP certification covering project lifecycle, scope, schedule, cost, quality, risk management, stakeholder engagement and agile hybrid approaches.","PMP Preparation Certificate"),
  c("Agile and Scrum Master Certification","Business Management","Non-IT","Intermediate",13999,"8 weeks","Lead agile teams covering Scrum framework, sprint planning, retrospectives, backlog grooming, burn-down charts, Kanban, SAFe and CSM exam preparation.","Scrum Master Certificate"),
  c("Six Sigma Green Belt","Business Management","Non-IT","Advanced",17999,"12 weeks","Drive process improvement using DMAIC framework, statistical analysis, hypothesis testing, control charts, measurement system analysis and CSSBB exam prep.","Six Sigma Green Belt Certificate"),

  # ── Non-IT: HR ──
  c("Core HR and Payroll Management","HR Management","Non-IT","Beginner",8999,"8 weeks","Build HR foundations covering recruitment, onboarding, attendance management, payroll calculations, ESI, PF, TDS, compliance and HR software tools.","HR and Payroll Certificate"),
  c("HR Analytics and People Management","HR Management","Non-IT","Intermediate",12999,"10 weeks","Use data for HR decisions covering workforce planning, attrition analysis, compensation benchmarking, employee engagement surveys and HR dashboards in Power BI.","HR Analytics Certificate"),
  c("Strategic HR Management","HR Management","Non-IT","Advanced",16999,"12 weeks","Lead people strategy covering HR business partnering, talent acquisition, L&D frameworks, succession planning, DEI initiatives and organizational development.","Strategic HR Certificate"),

  # ── Non-IT: Finance ──
  c("Tally Prime with GST and Accounting","Finance & Accounting","Non-IT","Beginner",6999,"6 weeks","Master accounting with Tally Prime covering ledger creation, voucher entry, bank reconciliation, GST returns GSTR1 3B 2A, TDS and financial report generation.","Tally Prime Certificate"),
  c("Advanced Accounting and Financial Statements","Finance & Accounting","Non-IT","Intermediate",10999,"8 weeks","Develop corporate accounting expertise covering journal entries, financial statement preparation, ratio analysis, fund flow, cash flow and IndAS accounting basics.","Advanced Accounting Certificate"),
  c("Financial Modeling and Valuation","Finance & Accounting","Non-IT","Advanced",16999,"10 weeks","Build investment-grade financial models in Excel covering DCF valuation, LBO modeling, comparable company analysis, sensitivity analysis and investor presentations.","Financial Modeling Certificate"),
  c("GST and Direct Tax Practitioner","Finance & Accounting","Non-IT","Beginner",7999,"6 weeks","Become a tax practitioner covering GST registration, return filing GSTR-1 3B 9, ITC reconciliation, income tax computation, TDS filing and e-way bill generation.","Tax Practitioner Certificate"),

  # ── Non-IT: Communication ──
  c("Business Communication and Writing","Language & Communication","Non-IT","Intermediate",7999,"8 weeks","Communicate professionally covering business email writing, report preparation, presentation skills, meeting facilitation, conflict resolution and cross-cultural communication.","Business Communication Certificate"),
  c("IELTS Preparation Course","Language & Communication","Non-IT","Intermediate",9999,"8 weeks","Achieve your target IELTS band with structured preparation covering Reading, Listening, Writing and Speaking with timed practice tests and score-boosting strategies.","IELTS Readiness Certificate"),

  # ── Design: UI/UX ──
  c("UI UX Design Fundamentals","UI/UX Design","Design","Beginner",10999,"8 weeks","Begin your product design career covering design thinking, user research, wireframing, information architecture, color theory, typography and low-fidelity prototyping.","UI/UX Fundamentals Certificate"),
  c("Advanced UI UX Design with Figma","UI/UX Design","Design","Intermediate",14999,"10 weeks","Design production-ready digital products in Figma covering high-fidelity mockups, interactive prototyping, design systems, usability testing and developer handoff.","UI/UX Professional Certificate"),
  c("Product Design and UX Research","UI/UX Design","Design","Advanced",19999,"12 weeks","Lead product design end to end covering advanced UX research methods, journey mapping, service design, accessibility standards, A/B testing and design leadership.","Product Designer Certificate"),

  # ── Design: Adobe ──
  c("Adobe Photoshop for Beginners","Graphic Design","Design","Beginner",8999,"6 weeks","Edit and retouch images professionally covering layers, masks, selection tools, color adjustments, filters, photo manipulation and preparing visuals for print and web.","Photoshop Essentials Certificate"),
  c("Adobe Illustrator and Vector Graphics","Graphic Design","Design","Intermediate",10999,"8 weeks","Create scalable vector artwork covering shapes, paths, typography, gradients, pattern creation, logo design workflow, brand identity guidelines and production file prep.","Adobe Illustrator Certificate"),

  # ── Design: Video ──
  c("Video Editing with Premiere Pro","Video Production","Design","Beginner",9999,"8 weeks","Edit professional videos with Adobe Premiere Pro covering timeline editing, transitions, color grading, audio mixing, motion text and exporting for YouTube and social media.","Video Editing Certificate"),
  c("Motion Graphics with After Effects","Video Production","Design","Intermediate",13999,"10 weeks","Animate stunning motion graphics using After Effects covering keyframe animation, masks, shape layers, expressions, particle effects, 3D layers and compositing workflows.","Motion Graphics Certificate"),

  # ── Design: CAD ──
  c("AutoCAD 2D and 3D Design","CAD Design","Design","Intermediate",11999,"10 weeks","Create precise technical drawings with AutoCAD covering 2D drafting, dimensioning, blocks, layouts, plotting and 3D solid body and surface modeling techniques.","AutoCAD Designer Certificate"),
  c("Architecture and Interior Design with SketchUp","CAD Design","Design","Advanced",16999,"12 weeks","Develop professional architectural visualizations using SketchUp Pro covering 3D modeling from floor plans, V-Ray rendering, materials and lighting simulation.","Architectural Design Certificate"),
]

all_modes = ["Online", "Offline", "Hybrid"]
new_entries = []
for i, co in enumerate(new_courses):
    entry = {
        "id": max_id + i + 1,
        "name": co["name"],
        "slug": make_slug(co["name"]),
        "category": co["category"],
        "main_category": co["main_category"],
        "level": co["level"],
        "modes": all_modes,
        "duration": co["duration"],
        "price": co["price"],
        "description": co["description"],
        "certification": co["certification"],
        "batch_options": "Weekday / Weekend / Flexible",
        "locations": "Pune, Mumbai, Hyderabad, Bangalore, Delhi",
        "thumbnail": f"https://via.placeholder.com/400x250?text={co['name'].replace(' ', '+')}"
    }
    new_entries.append(entry)

all_courses = courses + new_entries
with open(json_path, 'w') as f:
    json.dump(all_courses, f, indent=2)

from collections import Counter
levels = Counter(e['level'] for e in new_entries)
cats = Counter(e['main_category'] for e in new_entries)
print(f"[OK] Added {len(new_entries)} new courses")
print(f"[TOTAL] Database now has {len(all_courses)} courses")
print(f"\nNew by level: {dict(levels)}")
print(f"New by category: {dict(cats)}")
print("\nNew IT sub-categories:", sorted(set(e['category'] for e in new_entries if e['main_category']=='IT')))
print("New Non-IT sub-categories:", sorted(set(e['category'] for e in new_entries if e['main_category']=='Non-IT')))
print("New Design sub-categories:", sorted(set(e['category'] for e in new_entries if e['main_category']=='Design')))
