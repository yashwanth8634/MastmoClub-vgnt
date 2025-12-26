import { z } from "zod";

// --- VGNT BRANCH CODES ---
export const BRANCH_CODES: Record<string, string> = {
  "CSE": "05",
  "CSM": "66",
  "CSD": "67",
  "AIML": "54",
  "IT": "12",
  "ECE": "04",
  "EEE": "02",
  "CIVIL": "01",
  "MECH": "03"
};

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

// --- ZOD SCHEMA ---
export const RegistrationSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  rollNo: z.string().toUpperCase().min(10, "Invalid Roll No"),
  branch: z.string().min(1, "Branch is required"),
  section: z.string().min(1, "Section is required"), // 👈 Added Validation
  year: z.string().min(1, "Year is required"),
 
  
  teamName: z.string().optional().or(z.literal("")).or(z.null()), 
  
  teamMembers: z.array(
    z.object({
      name: z.string(),
      rollNo: z.string(),
    })
  ).optional().default([]), // Default to empty array
});