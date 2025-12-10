# VGNT Department Codes Reference

## Official Department Codes

The following are the official department codes used in VGNT College roll numbers. Each branch has a unique 2-digit code used in the roll number format.

### Department Code Mapping

| Department | Code | Full Name |
|-----------|------|-----------|
| MECH | 03 | Mechanical Engineering |
| ECE | 04 | Electronics & Communication Engineering |
| CSE | 05 | Computer Science & Engineering |
| EEE | 02 | Electrical & Electronics Engineering |
| CIVIL | 01 | Civil Engineering |
| IT | 12 | Information Technology |
| CSM | 66 | Computer Science (Artificial Intelligence & Machine Learning) |
| AIML | 54 | Artificial Intelligence & Machine Learning (AI&DS) |
| CSD | 67 | Computer Science & Design |

## Roll Number Format

Roll numbers follow different patterns based on admission type:

### Regular Admission (1st Year Entry)
Pattern: `YYAA1ABBCC`
- `YY` = Year (e.g., 24 = 2024)
- `AA` = Fixed digits (89)
- `1A` = Regular admission marker
- `BB` = **Department Code** (from table above)
- `CC` = Student ID (unique within department)
- Example: `24891A0593` (CSE regular student in 2024)

### Lateral Entry (2nd Year Entry)
Pattern: `YYAA5ABBCC`
- `YY` = Year (e.g., 25 = 2025)
- `AA` = Fixed digits (89 or 85, typically 85 for lateral)
- `5A` or `5B` = Lateral entry marker (from diploma/other courses)
- `BB` = **Department Code** (from table above)
- `CC` = Student ID (unique within department)
- Example: `25895A0508` (CSE lateral entry student in 2025)

### Key Differences

| Aspect | Regular (1A) | Lateral (5A/5B) |
|--------|-------------|-----------------|
| Admission | 1st Year | 2nd Year |
| Duration | 4-Year Course | 2-Year Course |
| Eligibility | 12th Pass | Diploma/Other Degree |
| Roll Format | YY891ABBCC | YY895ABBCC |
| Example | 24891A0593 | 25895A0508 |

## Examples

### Regular Students (1A) - 4 Year Course

| Branch | Department Code | Example Roll No | Meaning |
|--------|-----------------|-----------------|---------|
| CSE | 05 | 24891A0593 | CSE regular student enrolled in 2024, ID 93 |
| CSM | 66 | 24891A6609 | CSM regular student enrolled in 2024, ID 09 |
| CSD | 67 | 24891A6705 | CSD regular student enrolled in 2024, ID 05 |
| AIML | 54 | 24891A5412 | AIML regular student enrolled in 2024, ID 12 |
| IT | 12 | 24891A1207 | IT regular student enrolled in 2024, ID 07 |

### Lateral Entry Students (5A/5B) - 2 Year Course

| Branch | Department Code | Example Roll No | Meaning |
|--------|-----------------|-----------------|---------|
| CSE | 05 | 25895A0508 | CSE lateral entry student enrolled in 2025, ID 08 |
| IT | 12 | 25895A1210 | IT lateral entry student enrolled in 2025, ID 10 |
| CSM | 66 | 25895A6615 | CSM lateral entry student enrolled in 2025, ID 15 |
| ECE | 04 | 25895A0420 | ECE lateral entry student enrolled in 2025, ID 20 |

## Important Notes

- **Regular (1A) vs Lateral (5A/5B)**:
  - Regular: `YY891ABBCC` (4-year course, 1st year entry)
  - Lateral: `YY895ABBCC` (2-year course, 2nd year entry from diploma)
  - Key difference: `891` vs `895` in the middle of roll number
  - Both are fully supported in the system

- **CSE vs CSM vs CSD**: These are three different branches
  - CSE (05): Computer Science & Engineering
  - CSM (66): Computer Science (Artificial Intelligence & Machine Learning)
  - CSD (67): Computer Science & Design

- **AIML vs CSM**: Both focus on AI/ML but are different codes
  - AIML (54): AI&DS program
  - CSM (66): CS with AI/ML specialization

- **Branch Code Validation**:
  - System validates the branch code matches selected branch
  - Works for both regular and lateral entry students
  - Error if mismatch: "Roll No mismatch! You selected [Branch] but Roll No contains code '[Code]'"

## System Implementation

In the MASTMO Club registration system (both `/join` membership and event registrations):
1. User selects their branch from dropdown
2. User enters their roll number (can be regular or lateral)
3. System validates:
   - Format: Regular (YY891ABBCC) or Lateral (YY895ABBCC)
   - Branch code matches selected branch
   - Validates duplicate email, phone, and roll number
4. If all validations pass → Registration created
5. If any validation fails → Clear error message shown

- **Validation**: Roll numbers are validated against the selected department
  - User selects branch from dropdown
  - System validates that roll number matches selected branch code
  - If mismatch, error: "Roll No mismatch! You selected [Branch] but Roll No contains code '[Code]'"

## System Implementation

In the MASTMO Club registration system:
1. User selects their branch from dropdown (CSE, AIML, CSD, IT, etc.)
2. User enters their roll number
3. System extracts the department code from roll number (positions 6-8)
4. System compares extracted code with selected branch
5. If codes match → Valid
6. If codes don't match → Error message

This prevents mismatches where users accidentally select wrong branch while registering.
