/**
 * Generate sitemap.xml for SEO
 */
const fs = require('fs');
const path = require('path');
const courses = require('../courses_data.js');

const BASE = 'https://trainermentors.com';
const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// Static pages
const pages = [
  { path: '/', freq: 'daily', priority: '1.0' },
  { path: '/courses', freq: 'daily', priority: '0.9' },
  { path: '/about', freq: 'monthly', priority: '0.7' },
  { path: '/contact', freq: 'monthly', priority: '0.7' },
  { path: '/placements', freq: 'weekly', priority: '0.8' },
  { path: '/courses/technical', freq: 'weekly', priority: '0.8' },
  { path: '/courses/non-technical', freq: 'weekly', priority: '0.8' },
  { path: '/courses/corporate', freq: 'weekly', priority: '0.8' },
];

pages.forEach(p => {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE}${p.path}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${p.freq}</changefreq>\n`;
  xml += `    <priority>${p.priority}</priority>\n`;
  xml += `  </url>\n`;
});

// Course pages
courses.forEach(c => {
  xml += `  <url>\n`;
  xml += `    <loc>${BASE}/course/${c.slug}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += `  </url>\n`;
});

xml += '</urlset>';

const outputPath = path.join(__dirname, '..', 'frontend', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, xml);
console.log(`Sitemap generated: ${pages.length + courses.length} URLs`);
console.log(`Written to: ${outputPath}`);
