// Map Branch Names to Codes based on VGNT standard
// Reference: VGNT College Department Codes
const BRANCH_CODES: Record<string, string> = {
  "CSE": "05",   // Computer Science & Engineering
  "CSM": "66",   // Computer Science (Artificial Intelligence & Machine Learning)
  "CSD": "67",   // Computer Science & Design
  "AIML": "54",  // Artificial Intelligence & Machine Learning (AI&DS)
  "IT": "12",    // Information Technology
  "ECE": "04",   // Electronics & Communication Engineering
  "EEE": "02",   // Electrical & Electronics Engineering
  "CIVIL": "01", // Civil Engineering
  "MECH": "03"   // Mechanical Engineering
};

export function validateRollNo(rollNo: string, selectedBranch: string): string | null {
  const upperRoll = rollNo.toUpperCase();
  
  // Regular students: 24891A0593 (YY891ABBCC where A = regular)
  const regularRegex = /^\d{2}891A\d{2}[A-Z0-9]{2}$/;
  
  // Lateral entry students: 25895A0508 (YY895ABBCC where 5A/5B = lateral, BB = branch code)
  const lateralRegex = /^\d{2}895[AB]\d{2}[A-Z0-9]{2}$/;
  
  const isRegular = regularRegex.test(upperRoll);
  const isLateral = lateralRegex.test(upperRoll);
  
  if (!isRegular && !isLateral) {
    return "Invalid Roll Number format. Must follow VGNT standard:\n- Regular: 24891A0593 (4-year course)\n- Lateral: 25895A0508 (3-year course)";
  }

  // Extract branch code (position 6-8 for both formats)
  const actualCode = upperRoll.substring(6, 8);
  const expectedCode = BRANCH_CODES[selectedBranch];

  if (expectedCode && actualCode !== expectedCode) {
    return `Roll No mismatch! You selected ${selectedBranch} but Roll No contains code '${actualCode}' (expected '${expectedCode}').`;
  }

  return null; // No error
}