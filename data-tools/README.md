# data-tools — Course Catalog Management Scripts

These Python scripts manage the `courses_data.json` master catalog at the project root.
Always run them from the **project root** (not this folder) OR from inside `data-tools/` — paths are resolved automatically.

---

## Scripts

| Script | Purpose |
|---|---|
| `add_courses.py` | Manually add new course entries to `courses_data.json` |
| `import_koenig_courses.py` | Scrape Koenig Solutions sitemap and import new courses |
| `import_excel_courses.py` | Import courses from an Excel spreadsheet |
| `gen_sql.py` | Generate MySQL `INSERT` statements for Hostinger DB deployment |
| `regen_js.py` | Re-generate `courses_data.js` from `courses_data.json` (run after any JSON edit) |
| `verify_courses.py` | Print catalog statistics and validate integrity |
| `format_courses.py` | Format/transform intermediate parsed data |
| `parse_courses.py` | Parse raw Excel exports into `parsed_courses.json` |
| `generate_js_courses.py` | Convert `formatted_courses.json` → JS module |

## Data Files (intermediate — not served to the website)

| File | Description |
|---|---|
| `Koenig_TrainerMentors_Prompting_Strategy_Guide.xlsx` | Source Excel file for Koenig course strategy |
| `excel_courses_raw.json` | Raw extraction from Excel, before transformation |
| `parsed_courses.json` | Partially processed courses |
| `formatted_courses.json` | Fully formatted courses before final merge |

## Quick Usage

```powershell
# After editing courses_data.json, always regen the JS module:
python data-tools/regen_js.py

# Add courses in bulk from the Excel strategy guide:
python data-tools/import_koenig_courses.py

# Generate SQL patch for Hostinger deployment:
python data-tools/gen_sql.py > deployment/courses_patch.sql

# Verify catalog integrity:
python data-tools/verify_courses.py
```

## Important

- The **live website** reads from `courses_data.js` (loaded by `mock-api-server.js`).
- After any changes to `courses_data.json`, run `regen_js.py` to keep both files in sync.
