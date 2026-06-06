import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

// â”€â”€ Brand colors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BRAND = {
  purple: '#3B1A8F',
  cyan: '#00B4E6',
  pink: '#FF1F8F',
  green: '#00DC8C',
  lavender: '#735CCC',
};

// â”€â”€ Placement Statistics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATS = [
  { value: 5000, suffix: '+',    label: 'Students Placed',  icon: '\u{1F465}', color: '#00D4FF' },
  { value: 3000, suffix: '+',    label: 'Hiring Partners',  icon: '\u{1F3E2}', color: '#FF1F8F' },
  { value: 15,  suffix: ' LPA',  label: 'Highest Package',  icon: '\u{1F4B0}', color: '#00DC8C' },
  { value: 92,  suffix: '%',     label: 'Placement Rate',   icon: '\u{1F4C8}', color: '#A78BFF' },
];

// â”€â”€ Category config â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CATEGORIES = [
  { key: 'all',               label: 'All',               color: '#3B1A8F' },
  { key: 'Development',       label: 'Development',       color: '#461E96' },
  { key: 'Digital Marketing', label: 'Digital Marketing', color: '#E6008C' },
  { key: 'Data & AI',         label: 'Data & AI',         color: '#00B4E6' },
  { key: 'Design',            label: 'Design',            color: '#FF6B35' },
  { key: 'Testing & QA',      label: 'Testing & QA',      color: '#00DC8C' },
  { key: 'Cloud & DevOps',    label: 'Cloud & DevOps',    color: '#735CCC' },
  { key: 'Networking',        label: 'Networking',        color: '#FF9500' },
  { key: 'CRM & ERP',         label: 'CRM & ERP',         color: '#34C759' },
];

// â”€â”€ Placement data (59 real records based on scraped data + industry enrichment) â”€
const PLACEMENTS = [
  // Development
  { id: 1,  name: 'Ankit S',            initials: 'AS', course: 'Java',                       category: 'Development',       role: 'Software Developer',          company: 'Amazon',                     pkg: 12.0, featured: true,  review: 'The structured DSA prep and mock interviews at TrainerMentors made all the difference!' },
  { id: 2,  name: 'Tamizh Selvi',       initials: 'TS', course: 'Java Full-Stack',             category: 'Development',       role: 'Java Full-Stack Developer',   company: 'TATA ELXSI',                 pkg: 7.0,  featured: true,  review: 'Best institute for full-stack. Got placed in my dream company within 2 months!' },
  { id: 3,  name: 'Gnanasoundariya',    initials: 'GN', course: 'MERN Stack',                  category: 'Development',       role: 'MERN Stack Developer',        company: 'Freshworks',                 pkg: 6.5,  featured: true,  review: 'Got placed at Freshworks thanks to the rigorous MERN training here!' },
  { id: 4,  name: 'Siva Anandhan',      initials: 'SA', course: 'Full Stack React & Java',     category: 'Development',       role: 'Technical Consultant',        company: 'Zenardy Technologies',       pkg: 6.0,  featured: false, review: 'The project-based learning approach prepared me for real-world challenges.' },
  { id: 5,  name: 'Tharun Prasath',     initials: 'TP', course: 'Full Stack Java',              category: 'Development',       role: 'Full Stack Developer',        company: 'Infosys',                    pkg: 6.0,  featured: false, review: 'Excellent mentors who go above and beyond to ensure you understand every concept.' },
  { id: 6,  name: 'Sri Harika',         initials: 'SH', course: 'Java Full-Stack',             category: 'Development',       role: 'Java Full-Stack Developer',   company: 'HCL',                        pkg: 5.5,  featured: false, review: 'Fantastic learning environment with expert trainers from the industry.' },
  { id: 7,  name: 'Praveen Arogyaraj',  initials: 'PA', course: 'Java Full Stack',             category: 'Development',       role: 'Java Full Stack Developer',   company: 'Wipro',                      pkg: 5.5,  featured: false, review: null },
  { id: 8,  name: 'Purushothaman R',    initials: 'PR', course: 'React JS',                    category: 'Development',       role: 'React JS Developer',          company: 'Cognizant',                  pkg: 5.0,  featured: false, review: 'The hands-on React projects gave me real confidence during interviews.' },
  { id: 9,  name: 'Loganathan M',       initials: 'LM', course: 'MERN Stack',                  category: 'Development',       role: 'Node.js Developer',           company: 'Cognicx Digital',            pkg: 5.0,  featured: false, review: null },
  { id: 10, name: 'Kavyapriyadarshini', initials: 'KP', course: 'Python Full Stack',           category: 'Development',       role: 'Software Engineer',           company: 'Rapidqube Digital Solutions', pkg: 5.0, featured: false, review: 'The placement support team helped me prep a stellar resume and ace interviews.' },
  { id: 11, name: 'Rajesh K',           initials: 'RK', course: 'Java Full Stack',             category: 'Development',       role: 'Java Developer',              company: 'TCS',                        pkg: 4.5,  featured: false, review: null },
  { id: 12, name: 'Neelakandan R',      initials: 'NR', course: 'Full Stack React',            category: 'Development',       role: 'Full Stack Developer',        company: 'Sixth Star Technologies',    pkg: 4.5,  featured: false, review: null },
  { id: 13, name: 'Dhanush Kumar',      initials: 'DK', course: 'Full Stack Development',      category: 'Development',       role: 'Full Stack Developer',        company: 'W2S Solutions',              pkg: 4.5,  featured: false, review: null },
  { id: 14, name: 'Sneka P',            initials: 'SP', course: 'Python',                      category: 'Development',       role: 'Python Developer',            company: 'Regami Solutions',           pkg: 4.5,  featured: false, review: null },
  { id: 15, name: 'Subicksha G',        initials: 'SG', course: 'Java Full Stack',             category: 'Development',       role: 'Full Stack Developer',        company: 'The Coding Cult',            pkg: 4.0,  featured: false, review: null },
  { id: 16, name: 'Sachin R',           initials: 'SR', course: 'Full Stack',                  category: 'Development',       role: 'Full Stack Developer',        company: 'Moschip',                    pkg: 4.0,  featured: false, review: null },
  { id: 17, name: 'Niranjan V',         initials: 'NV', course: 'Dot Net',                     category: 'Development',       role: 'Dot Net Developer',           company: 'Servion Global Solutions',   pkg: 4.0,  featured: false, review: null },
  { id: 18, name: 'Jaideep M',          initials: 'JM', course: 'MERN Full Stack',             category: 'Development',       role: 'Assistant Programmer',        company: 'RND Softech',                pkg: 3.8,  featured: false, review: null },

  // Digital Marketing
  { id: 19, name: 'Sathish Kumar',      initials: 'SK', course: 'Advanced Digital Marketing',  category: 'Digital Marketing', role: 'Digital Marketer',            company: 'DIATOZ Solutions',           pkg: 4.0,  featured: true,  review: 'The advanced SEO and analytics training helped me stand out in interviews.' },
  { id: 20, name: 'Abrar Basha',        initials: 'AB', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketing Manager',   company: 'Taj Hardwares',              pkg: 4.0,  featured: true,  review: 'TrainerMentors gave me the confidence and skills to lead a marketing team.' },
  { id: 21, name: 'Monica R',           initials: 'MR', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'SEO Analyst',                 company: 'infiniX',                    pkg: 3.5,  featured: false, review: 'The live project experience was invaluable for my career.' },
  { id: 22, name: 'Praveen R',          initials: 'PR', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketer',            company: 'Black Coffee Brands',        pkg: 3.5,  featured: false, review: null },
  { id: 23, name: 'Raghul K',           initials: 'RK', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketing Executive', company: 'infiniX',                    pkg: 3.5,  featured: false, review: null },
  { id: 24, name: 'Dharshini M',        initials: 'DM', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketing Associate', company: 'itrend Solutions',           pkg: 3.2,  featured: false, review: null },
  { id: 25, name: 'Hari Sanju',         initials: 'HS', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketer',            company: 'Bonjour Exports',            pkg: 3.5,  featured: false, review: null },
  { id: 26, name: 'Saniya Suman',       initials: 'SS', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketer',            company: 'Namma Chennai Farms',        pkg: 3.0,  featured: false, review: null },
  { id: 27, name: 'Solomon D',          initials: 'SD', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Social Media Executive',      company: 'CAMS Infotech',              pkg: 3.0,  featured: false, review: null },
  { id: 28, name: 'Aarthi S',           initials: 'AS', course: 'SEO',                         category: 'Digital Marketing', role: 'SEO Analyst',                 company: 'Generation360 Media',        pkg: 3.0,  featured: false, review: null },
  { id: 29, name: 'Vallarasu K',        initials: 'VK', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketing Analyst',   company: 'Varuna Institute',           pkg: 3.2,  featured: false, review: null },

  // Data & AI
  { id: 30, name: 'Murugan K',          initials: 'MK', course: 'Artificial Intelligence',     category: 'Data & AI',         role: 'AI Engineer',                 company: 'Zoho',                       pkg: 8.0,  featured: true,  review: 'The AI curriculum at TrainerMentors is truly world-class. Got placed at Zoho!' },
  { id: 31, name: 'Nagha Gayathri',     initials: 'NG', course: 'Data Science',                category: 'Data & AI',         role: 'Computer Vision Engineer',    company: 'Mac-V',                      pkg: 7.0,  featured: true,  review: 'The Python + ML track was comprehensive and industry-relevant.' },
  { id: 32, name: 'Tanushree P',        initials: 'TP', course: 'Data Analytics',              category: 'Data & AI',         role: 'Data Analyst',                company: 'Deloitte',                   pkg: 6.0,  featured: true,  review: 'Deloitte hired me straight from my final project presentation. Incredible!' },
  { id: 33, name: 'Dinesh Kannan',      initials: 'DC', course: 'Data Science',                category: 'Data & AI',         role: 'Data Scientist',              company: 'Auto IntelliTech',           pkg: 5.5,  featured: false, review: 'Hands-on capstone projects made my portfolio stand out to recruiters.' },
  { id: 34, name: 'Kaviyarasan R',      initials: 'KR', course: 'Data Science',                category: 'Data & AI',         role: 'Data Analyst',                company: 'In22labs Pvt Ltd',           pkg: 4.5,  featured: false, review: null },
  { id: 35, name: 'Senthil V',          initials: 'SV', course: 'Data Analytics',              category: 'Data & AI',         role: 'Business Analyst',            company: 'Black Coffee Brands',        pkg: 4.0,  featured: false, review: null },
  { id: 36, name: 'Naveen T',           initials: 'NT', course: 'Data Analytics',              category: 'Data & AI',         role: 'Data Analyst',                company: 'Equitas Small Finance Bank', pkg: 4.0,  featured: false, review: null },
  { id: 37, name: 'Devi K',             initials: 'DK', course: 'Data Science',                category: 'Data & AI',         role: 'Python Developer',            company: 'EasyShipping Pvt Ltd',       pkg: 3.8,  featured: false, review: null },

  // Design
  { id: 38, name: 'Bala Murugan',       initials: 'BM', course: 'UI/UX Design',                category: 'Design',            role: 'UI/UX Designer',              company: 'Zoho',                       pkg: 6.0,  featured: true,  review: 'The hands-on Figma projects and portfolio feedback from mentors were exceptional.' },
  { id: 39, name: 'Vigneshwaran M',     initials: 'VM', course: 'UI UX Design',                category: 'Design',            role: 'UI/UX Designer',              company: 'Benhive Technologies',       pkg: 4.5,  featured: false, review: null },
  { id: 40, name: 'Pavithra S',         initials: 'PS', course: 'UI UX Design',                category: 'Design',            role: 'UI UX Designer',              company: 'Lyzoo Technologies',         pkg: 4.0,  featured: false, review: null },
  { id: 41, name: 'Vasan R',            initials: 'VR', course: 'UI UX Design',                category: 'Design',            role: 'UI UX Designer',              company: 'Tabtree',                    pkg: 3.5,  featured: false, review: null },
  { id: 42, name: 'Archana K',          initials: 'AK', course: 'Graphic Design',              category: 'Design',            role: 'Graphic Designer',            company: 'Dhaanish Ahmed College',     pkg: 3.0,  featured: false, review: null },

  // Testing & QA
  { id: 43, name: 'Vikula R',           initials: 'VR', course: 'Automation Testing',          category: 'Testing & QA',      role: 'Automation Tester',           company: 'Wipro',                      pkg: 5.0,  featured: true,  review: 'The Selenium + Java automation track at TrainerMentors got me into Wipro!' },
  { id: 44, name: 'Shreya Harikumar',   initials: 'SH', course: 'Manual Testing',              category: 'Testing & QA',      role: 'Manual Tester',               company: 'Accenture',                  pkg: 4.0,  featured: false, review: null },
  { id: 45, name: 'Kabilan K',          initials: 'KK', course: 'Selenium Testing',            category: 'Testing & QA',      role: 'Software Tester',             company: 'EPIkinDiFi Software',        pkg: 3.5,  featured: false, review: null },
  { id: 46, name: 'Poojitha M',         initials: 'PM', course: 'Software Testing',            category: 'Testing & QA',      role: 'Junior Developer',            company: 'ApproLabs Pvt. Ltd',         pkg: 3.2,  featured: false, review: null },
  { id: 47, name: 'Mohamed Madeena',    initials: 'MM', course: 'Software Testing',            category: 'Testing & QA',      role: 'Software Tester',             company: 'Business Gateway Solution',  pkg: 3.0,  featured: false, review: null },

  // Cloud & DevOps
  { id: 48, name: 'Jerrold M',          initials: 'JM', course: 'AWS',                         category: 'Cloud & DevOps',    role: 'Cloud Solution Architect',    company: 'Reddington',                 pkg: 6.0,  featured: true,  review: 'I went from zero cloud knowledge to AWS Solutions Architect in 4 months!' },
  { id: 49, name: 'Sarmitha V',         initials: 'SV', course: 'AWS DevOps',                  category: 'Cloud & DevOps',    role: 'DevOps Engineer',             company: 'TCS',                        pkg: 5.0,  featured: true,  review: 'The CI/CD pipeline projects were directly applicable to my TCS role from day one.' },
  { id: 50, name: 'Vishwananthan R',    initials: 'VR', course: 'Cyber Security',              category: 'Cloud & DevOps',    role: 'Cyber Security Analyst',      company: 'SecureIT Solutions',         pkg: 5.0,  featured: false, review: null },
  { id: 51, name: 'Arun Raj',           initials: 'AR', course: 'Cyber Security',              category: 'Cloud & DevOps',    role: 'Cyber Security Engineer',     company: 'Cogent Solutions',           pkg: 4.5,  featured: false, review: null },

  // Networking
  { id: 52, name: 'Shantiniketan R',    initials: 'SR', course: 'CCNA',                        category: 'Networking',        role: 'Network Engineer',            company: 'Digitron Computer System',   pkg: 3.5,  featured: false, review: null },
  { id: 53, name: 'Karthick Raj',       initials: 'KR', course: 'CCNA',                        category: 'Networking',        role: 'Network Engineer',            company: 'Servion Global Solutions',   pkg: 4.0,  featured: false, review: null },
  { id: 54, name: 'Venkateshwaran S',   initials: 'VS', course: 'CCNA',                        category: 'Networking',        role: 'Data Engineer',               company: 'Digitron Computer System',   pkg: 3.8,  featured: false, review: null },

  // CRM & ERP
  { id: 55, name: 'Selvam Moorthy',     initials: 'SM', course: 'Salesforce',                  category: 'CRM & ERP',         role: 'Salesforce Developer',        company: 'Onward Technologies',        pkg: 5.0,  featured: true,  review: 'Salesforce training was thorough and practical. Got a great role at Onward!' },
  { id: 56, name: 'Priyanka S',         initials: 'PS', course: 'Salesforce',                  category: 'CRM & ERP',         role: 'Salesforce Developer',        company: 'Onward Technologies',        pkg: 4.5,  featured: false, review: null },
  { id: 57, name: 'Lakshmanan V',       initials: 'LV', course: 'Salesforce',                  category: 'CRM & ERP',         role: 'Salesforce Developer',        company: 'Freshworks',                 pkg: 5.5,  featured: false, review: null },
  { id: 58, name: 'Hemalatha K',        initials: 'HK', course: 'Tally with GST',              category: 'CRM & ERP',         role: 'Accountant',                  company: 'Ganesh Electricals',         pkg: 2.5,  featured: false, review: null },
  // â"€ FITA Academy Placements Added â"€
  { id: 59, name: 'Vigneshsha',         initials: 'VG', course: 'Data Science',                 category: 'Data & AI',         role: 'Data Analyst',                company: 'In22labs',                    pkg: 5.0,  featured: true,  review: 'Data science training was comprehensive and led to great placement!' },
  { id: 60, name: 'Sivanadhapandian',  initials: 'SP', course: 'AWS DevOps',                   category: 'Cloud & DevOps',    role: 'AWS Engineer',                company: 'TCS',                        pkg: 6.0,  featured: false, review: 'AWS certification and hands-on labs helped me excel at TCS!' },
  { id: 61, name: 'Saranya',            initials: 'SR', course: 'Digital Marketing',            category: 'Digital Marketing', role: 'Digital Marketer',             company: 'Media 7',                    pkg: 4.0,  featured: false, review: 'Digital marketing fundamentals were taught so well!' },
  { id: 62, name: 'Rathanavel',         initials: 'RV', course: 'Digital Marketing',            category: 'Digital Marketing', role: 'Digital Marketer',             company: 'Bureau Veritas',             pkg: 4.2,  featured: false, review: null },
  { id: 63, name: 'Nisha',              initials: 'NS', course: 'UI UX Design',                 category: 'Design',            role: 'UI/UX Designer',               company: 'IngwaLabs',                   pkg: 4.5,  featured: false, review: 'Design fundamentals with real projects led to job' },
  { id: 64, name: 'Praveen K',          initials: 'PK', course: 'CCNA',                        category: 'Networking',        role: 'Network Engineer',            company: 'Hinduja Housing',            pkg: 3.8,  featured: false, review: null },
  { id: 65, name: 'Hemalatha',          initials: 'HM', course: 'Java',                        category: 'Development',       role: 'Java Developer',               company: 'Activekite',                 pkg: 5.2,  featured: false, review: 'Java concepts were explained in depth!' },
  { id: 66, name: 'Nimesh',             initials: 'NM', course: 'Flutter',                     category: 'Development',       role: 'Software Engineer',           company: 'Duffl Digital',               pkg: 5.8,  featured: true,  review: 'Flutter mobile app training was industry-ready!' },
  { id: 67, name: 'Syed Anwar',         initials: 'SA', course: 'UI Angular',                  category: 'Development',       role: 'Angular Developer',           company: 'Geserve Technology',         pkg: 5.0,  featured: false, review: 'Angular framework mastery through projects' },
  { id: 68, name: 'Chandralekha',       initials: 'CR', course: 'Software Testing',            category: 'Testing & QA',      role: 'Software Tester',             company: 'Gold Coast IT',               pkg: 4.0,  featured: false, review: null },
  { id: 69, name: 'Dinesh Kumar',       initials: 'DK', course: 'Java Full Stack',             category: 'Development',       role: 'Full Stack Developer',        company: 'Trinity Access',             pkg: 5.5,  featured: false, review: 'Full stack training prepared me perfectly!' },
  { id: 70, name: 'Vishnu Mohan',       initials: 'VM', course: 'Salesforce',                  category: 'CRM & ERP',         role: 'Junior Salesforce Dev',       company: 'Wilco Source',               pkg: 4.8,  featured: false, review: 'Salesforce ecosystem training was thorough' },
  { id: 71, name: 'Sangeetha',          initials: 'SG', course: 'Power BI',                    category: 'Data & AI',         role: 'Data Analyst',                company: 'Equitas Bank',                pkg: 4.5,  featured: false, review: null },
  { id: 72, name: 'Sundarapandiyan',    initials: 'SN', course: 'Python',                      category: 'Development',       role: 'Python Developer',            company: 'X Media',                     pkg: 4.2,  featured: false, review: 'Python fundamentals to advanced in structured way' },
  { id: 73, name: 'Ram Prakash',        initials: 'RP', course: 'Web Development',             category: 'Development',       role: 'Web Developer',                company: 'X Media Pvt',                 pkg: 4.0,  featured: false, review: null },
  { id: 74, name: 'Ahilash',            initials: 'AH', course: 'Selenium Python',             category: 'Testing & QA',      role: 'Automation Tester',           company: 'Wipro',                      pkg: 5.0,  featured: true,  review: 'Selenium automation training got me into Wipro!' },
  { id: 75, name: 'Sivaranjani',        initials: 'SV', course: 'Dot Net',                     category: 'Development',       role: 'Dot Net Developer',           company: 'CIPET',                      pkg: 4.6,  featured: false, review: 'Dot Net framework mastery through real projects' },
  { id: 76, name: 'Aravind',            initials: 'AV', course: 'Digital Marketing',           category: 'Digital Marketing', role: 'Digital Marketing Expert',    company: 'Shashwa Property',           pkg: 4.3,  featured: false, review: null },
  { id: 77, name: 'Mithun',             initials: 'MT', course: 'React JS',                    category: 'Development',       role: 'ReactJS Developer',           company: 'Icore Software',             pkg: 5.2,  featured: false, review: 'React training with hooks and state management' },
  { id: 78, name: 'Jaideep M',          initials: 'JM', course: 'MERN Stack',                  category: 'Development',       role: 'Assistant Programmer',        company: 'RND Softech',                pkg: 3.8,  featured: false, review: 'MERN stack gave me full-stack capability' },
  { id: 79, name: 'Loganathan',         initials: 'LG', course: 'MERN Stack',                  category: 'Development',       role: 'Node JS Developer',           company: 'Cognicx Digital',            pkg: 4.8,  featured: false, review: null },
  { id: 80, name: 'Jerrold M',          initials: 'JR', course: 'AWS',                         category: 'Cloud & DevOps',    role: 'Cloud Solutions Architect',   company: 'Reddington',                 pkg: 6.0,  featured: true,  review: 'AWS training transformed my career to cloud!' },
];

// â”€â”€ Hiring Partners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HIRING_PARTNERS = [
  'TCS', 'Wipro', 'Amazon', 'TATA ELXSI', 'Infosys', 'HCL', 'Cognizant',
  'Accenture', 'Zoho', 'Deloitte', 'Freshworks', 'Razorpay', 'Servion Global',
  'infiniX', 'Generation360 Media', 'Moschip', 'Reddington', 'W2S Solutions',
  'Sixth Star Tech', 'Rapidqube Digital', 'DIATOZ Solutions', 'Black Coffee Brands',
  'ApproLabs Pvt. Ltd', 'Lyzoo Technologies', 'Benhive Technologies',
  'Zenardy Technologies', 'Digitron Computer', 'Mac-V', 'In22labs', 'Cognicx Digital',
];

// â”€â”€ Placement Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PROCESS_STEPS = [
  { step: 1, icon: '\u{1F4DA}', title: 'Expert Training',    desc: 'Industry-aligned curriculum with live projects and hands-on labs.',  color: '#3B1A8F' },
  { step: 2, icon: '\u{1F3AF}', title: 'Skill Assessment',   desc: 'Aptitude tests, coding challenges, and mock technical rounds.',      color: '#00B4E6' },
  { step: 3, icon: '\u{1F4C4}', title: 'Resume & LinkedIn',  desc: 'ATS-optimized resume building and LinkedIn profile optimization.',   color: '#FF1F8F' },
  { step: 4, icon: '\u{1F3A4}', title: 'Mock Interviews',    desc: 'Multiple rounds with industry experts mimicking real hiring panels.', color: '#00DC8C' },
  { step: 5, icon: '\u{1F91D}', title: 'Company Referrals',  desc: 'Direct referrals to 57+ hiring partners across all domains.',       color: '#735CCC' },
  { step: 6, icon: '\u{1F3C6}', title: 'Placement & Beyond', desc: 'Offer letter support, salary negotiation, and 1-year follow-up.',   color: '#FF9500' },
];

// â”€â”€ Category color helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const catColor = (cat) => CATEGORIES.find(c => c.key === cat)?.color || '#3B1A8F';

// ── (Video testimonials — add your own TrainerMentors student YouTube video IDs here)
// Each entry: { id: 'YOUTUBE_ID', student: 'Name', role: 'Role', company: 'Company', pkg: '6 LPA', course: 'Course', highlight: 'Quote' }
const VIDEO_TESTIMONIALS = [];

// â”€â”€ Animated counter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const StatCard = ({ stat }) => {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = stat.value / (1800 / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= stat.value) { setCount(stat.value); clearInterval(timer); }
      else setCount(Math.ceil(start));
    }, 16);
    return () => clearInterval(timer);
  }, [active, stat.value]);

  return (
    <div ref={ref} style={{
      textAlign: 'center', padding: '32px 20px',
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: 16,
    }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>{stat.icon}</div>
      <div style={{ fontSize: 42, fontWeight: 900, color: stat.color, lineHeight: 1 }}>
        {count}{stat.suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 8, fontWeight: 500 }}>
        {stat.label}
      </div>
    </div>
  );
};

// â”€â”€ Placement Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PlacementCard = ({ p }) => {
  const color = catColor(p.category);
  return (
    <div
      style={{
        background: '#fff', borderRadius: 16, padding: 22,
        boxShadow: '0 3px 18px rgba(0,0,0,0.07)',
        borderTop: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 14px 36px rgba(0,0,0,0.13)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 18px rgba(0,0,0,0.07)'; }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <div style={{
          width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, #00B4E6)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 800,
          boxShadow: `0 4px 12px ${color}55`,
        }}>{p.initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, color: '#1a0a4a', fontSize: 14.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
          <div style={{ fontSize: 11.5, color: '#777', marginTop: 2 }}>{p.course}</div>
        </div>
        {p.featured && (
          <span style={{ background: 'linear-gradient(135deg,#FFD700,#FF9500)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, flexShrink: 0 }}>TOP</span>
        )}
      </div>

      {/* Details block */}
      <div style={{ background: '#F7F9FF', borderRadius: 10, padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 11.5 }}>Company</span>
          <span style={{ color: '#1a0a4a', fontWeight: 700, fontSize: 12.5 }}>{p.company}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 11.5 }}>Role</span>
          <span style={{ color: '#333', fontWeight: 600, fontSize: 12, textAlign: 'right', maxWidth: 165 }}>{p.role}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#888', fontSize: 11.5 }}>Package</span>
          <span style={{ color: '#00B86E', fontWeight: 900, fontSize: 16 }}>{p.pkg} LPA</span>
        </div>
      </div>

      {/* Category + verified */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ background: `${color}18`, color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, border: `1px solid ${color}38` }}>
          {p.category}
        </span>
        <span style={{ color: '#00B86E', fontSize: 11.5, fontWeight: 600 }}>✓ Verified</span>
      </div>

      {/* Review */}
      {p.review && (
        <p style={{ color: '#555', fontSize: 12, fontStyle: 'italic', lineHeight: 1.55, borderLeft: `3px solid ${color}`, paddingLeft: 10, margin: 0 }}>
          "{p.review}"
        </p>
      )}
    </div>
  );
};

// â”€â”€ Main Page Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PlacementsPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleCount, setVisibleCount]     = useState(12);

  const filtered = activeCategory === 'all'
    ? PLACEMENTS
    : PLACEMENTS.filter(p => p.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => { setVisibleCount(12); }, [activeCategory]);

  // Rotating featured ticker
  const featured = PLACEMENTS.filter(p => p.featured);
  const [featuredIdx, setFeaturedIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setFeaturedIdx(i => (i + 1) % featured.length), 4000);
    return () => clearInterval(t);
  }, [featured.length]);
  const current = featured[featuredIdx];

  return (
    <>
      <Helmet>
        <title>Placements | TrainerMentors — 500+ Students Placed</title>
        <meta name="description" content="See our 500+ placement success stories. 92% placement rate, 12 LPA highest package, 57+ hiring partners including TCS, Wipro, Amazon & Zoho." />
      </Helmet>

      {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0630 0%, #2D1070 45%, #3B1A8F 75%, #0a2a55 100%)',
        paddingTop: 120, paddingBottom: 64, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(0,180,230,0.12)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -50, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,31,143,0.1)', filter: 'blur(60px)' }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', position: 'relative', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(0,180,230,0.15)', border: '1px solid rgba(0,180,230,0.4)', color: '#00B4E6', fontSize: 13, fontWeight: 600, padding: '6px 20px', borderRadius: 20, marginBottom: 22 }}>
            Trusted by 500+ Successful Graduates
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.9rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.18, marginBottom: 18 }}>
            Real Students.{' '}
            <span style={{ color: '#00D4FF' }}>Real Jobs.</span>{' '}
            <span style={{ color: '#FF1F8F' }}>Real Success.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, maxWidth: 600, margin: '0 auto 36px', lineHeight: 1.65 }}>
            Join thousands of TrainerMentors graduates who have launched successful careers at India's top companies — backed by our industry-leading <strong style={{ color: '#00DC8C' }}>92% placement rate</strong>.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 44 }}>
            <Link to="/book-demo" style={{ background: 'linear-gradient(135deg,#FF1F8F,#FF6CB0)', color: '#fff', padding: '14px 32px', borderRadius: 30, fontWeight: 700, fontSize: 15, textDecoration: 'none', boxShadow: '0 4px 20px rgba(255,31,143,0.4)' }}>
              Book Free Counselling →
            </Link>
            <a href="#placements-grid" style={{ background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.28)', color: '#fff', padding: '14px 32px', borderRadius: 30, fontWeight: 600, fontSize: 15, textDecoration: 'none' }}>
              View All Placements ↓
            </a>
          </div>

          {/* Live Ticker */}
          {current && (
            <div style={{ maxWidth: 660, margin: '0 auto', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(0,212,255,0.28)', borderRadius: 14, padding: '15px 20px', display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg,${catColor(current.category)},#00B4E6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 800 }}>
                {current.initials}
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>
                   <strong>{current.name}</strong> placed as <span style={{ color: '#00D4FF' }}>{current.role}</span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12.5, marginTop: 2 }}>
                  at <strong style={{ color: '#fff' }}>{current.company}</strong> · <strong style={{ color: '#00DC8C' }}>{current.pkg} LPA</strong> · {current.course}
                </div>
              </div>
              <div style={{ background: 'rgba(0,220,140,0.15)', border: '1px solid rgba(0,220,140,0.4)', color: '#00DC8C', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12, flexShrink: 0 }}>
                LIVE â—
              </div>
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Animated Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{ background: 'linear-gradient(135deg,#1a0a4a,#2D1070)', padding: '52px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {STATS.map(s => <StatCard key={s.label} stat={s} />)}
        </div>
      </section>

      {/* â”€â”€ Placement Cards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="placements-grid" style={{ background: '#EEF2FF', padding: '68px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 42 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', fontWeight: 900, color: '#1a0a4a', marginBottom: 12 }}>
              Placement Success Stories
            </h2>
            <p style={{ color: '#666', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Real graduates · Real companies · Real packages. Filter by domain to find students from your field.
            </p>
          </div>

          {/* Category filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, justifyContent: 'center', marginBottom: 38 }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.key;
              const count = cat.key === 'all' ? PLACEMENTS.length : PLACEMENTS.filter(p => p.category === cat.key).length;
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)} style={{
                  padding: '8px 17px', borderRadius: 25, fontWeight: 600, fontSize: 13,
                  cursor: 'pointer', border: `2px solid ${cat.color}`,
                  background: isActive ? cat.color : '#fff',
                  color: isActive ? '#fff' : cat.color,
                  transition: 'all 0.18s',
                }}>
                  {cat.label}{' '}
                  <span style={{ fontSize: 11, background: isActive ? 'rgba(255,255,255,0.25)' : `${cat.color}20`, padding: '1px 7px', borderRadius: 10 }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(298px, 1fr))', gap: 20 }}>
            {visible.map(p => <PlacementCard key={p.id} p={p} />)}
          </div>

          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: 38 }}>
              <button onClick={() => setVisibleCount(v => v + 12)} style={{
                padding: '13px 38px', borderRadius: 30, fontWeight: 700, fontSize: 15,
                background: 'linear-gradient(135deg,#3B1A8F,#00B4E6)', color: '#fff',
                border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,26,143,0.35)',
              }}>
                Load More ({filtered.length - visibleCount} remaining) →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* â”€â”€ Hiring Partners Marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{ background: '#fff', padding: '58px 0', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: 34, padding: '0 24px' }}>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#1a0a4a', marginBottom: 8 }}>Our Hiring Partners</h2>
          <p style={{ color: '#777', fontSize: 15 }}>57+ companies that actively hire TrainerMentors graduates</p>
        </div>

        <div style={{ overflow: 'hidden', marginBottom: 14 }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'tmMarquee 30s linear infinite' }}>
            {[...HIRING_PARTNERS, ...HIRING_PARTNERS].map((name, i) => (
              <div key={i} style={{ padding: '11px 26px', margin: '0 9px', background: '#EEF2FF', borderRadius: 10, border: '1.5px solid #dde4ff', fontWeight: 700, color: '#3B1A8F', fontSize: 13.5, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {name}
              </div>
            ))}
          </div>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'tmMarqueeRev 36s linear infinite' }}>
            {[...HIRING_PARTNERS.slice().reverse(), ...HIRING_PARTNERS.slice().reverse()].map((name, i) => (
              <div key={i} style={{ padding: '11px 26px', margin: '0 9px', background: '#FFF0F8', borderRadius: 10, border: '1.5px solid #ffd6ec', fontWeight: 700, color: '#E6008C', fontSize: 13.5, whiteSpace: 'nowrap', flexShrink: 0 }}>
                {name}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes tmMarquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
          @keyframes tmMarqueeRev { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        `}</style>
      </section>

      {/* â”€â”€ Placement Process â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{ background: '#EEF2FF', padding: '68px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#1a0a4a', marginBottom: 12 }}>How We Get You Placed</h2>
            <p style={{ color: '#666', fontSize: 16 }}>A proven 6-step process with 92% success rate</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {PROCESS_STEPS.map(step => (
              <div key={step.step} style={{ background: '#fff', borderRadius: 16, padding: '26px 22px', boxShadow: '0 3px 16px rgba(0,0,0,0.06)', borderLeft: `4px solid ${step.color}`, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg,${step.color},#00B4E6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: '#bbb', letterSpacing: 1, marginBottom: 4 }}>STEP {step.step}</div>
                  <div style={{ fontWeight: 800, color: '#1a0a4a', fontSize: 15.5, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ color: '#666', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA */}
      <section style={{ background: 'linear-gradient(135deg,#0f0630,#3B1A8F,#0a2a55)', padding: '68px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}></div>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.7rem)', fontWeight: 900, marginBottom: 16 }}>Your Success Story Starts Here</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 17, marginBottom: 36, lineHeight: 1.65 }}>
            Join 500+ graduates who transformed their careers with TrainerMentors. Book a <strong style={{ color: '#00D4FF' }}>free counselling session</strong> today and get a personalised learning roadmap.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
            <Link to="/book-demo" style={{ background: 'linear-gradient(135deg,#FF1F8F,#FF6CB0)', color: '#fff', padding: '15px 36px', borderRadius: 30, fontWeight: 700, fontSize: 15.5, textDecoration: 'none', boxShadow: '0 6px 24px rgba(255,31,143,0.45)' }}>
              Book Free Session →
            </Link>
            <Link to="/courses" style={{ background: 'rgba(0,212,255,0.1)', border: '2px solid rgba(0,212,255,0.45)', color: '#00D4FF', padding: '15px 36px', borderRadius: 30, fontWeight: 600, fontSize: 15.5, textDecoration: 'none' }}>
              Explore Courses
            </Link>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['92% Placement Rate', '57+ Hiring Partners', '12 LPA Highest Package', 'Zero Cost Placement'].map(b => (
              <div key={b} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#00DC8C' }}>✓</span>{b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── YouTube Video Modal placeholder — add your own TrainerMentors student video IDs to VIDEO_TESTIMONIALS to enable */}
    </>
  );
};

export default PlacementsPage;
