import { BRANCH_CODES } from "./constants";

// --- HELPER: Extract "05" from "24891A0593" ---
export function getBranchCodeFromRoll(rollNo: string): string {
  const upper = rollNo.toUpperCase();
  // Valid codes are at index 6 and 7
  return upper.substring(6, 8);
}

// --- VALIDATION LOGIC ---
export function validateRollNo(rollNo: string, selectedBranch?: string): string | null {
  const upperRoll = rollNo.toUpperCase();
  const regularRegex = /^\d{2}891A\d{2}[A-Z0-9]{2}$/;
  const lateralRegex = /^\d{2}895[AB]\d{2}[A-Z0-9]{2}$/;
  
  if (!regularRegex.test(upperRoll) && !lateralRegex.test(upperRoll)) {
    return "Invalid Format"; 
  }

  if (selectedBranch) {
    const actualCode = getBranchCodeFromRoll(upperRoll);
    const expectedCode = BRANCH_CODES[selectedBranch];
    if (expectedCode && actualCode !== expectedCode) {
      return `Mismatch: Branch is ${selectedBranch} but Roll No has code '${actualCode}'`;
    }
  }

  return null;
}