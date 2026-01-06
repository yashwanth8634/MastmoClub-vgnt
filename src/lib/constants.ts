export const COLLEGE_NAME = "VGNT";

export const BRANCH_CODES: Record<string, string> = {
  "CSE": "05",
  "CSE(AI&ML)": "66",
  "CSE(DS)": "67",
  "AI&ML": "54",
  "CSE(IT)": "12",
  "ECE": "04",
  "EEE": "02",
  "CIVIL": "01",
  "MECH": "03",
  "AI&DS": "72" // Added AI&DS based on usage in EventRegisterForm
};

export const BRANCHES = Object.keys(BRANCH_CODES);

export const DEPARTMENTS = ["BS&H", ...BRANCHES];

export const SECTIONS = ["A", "B", "C", "D"];

export const YEARS = ["1", "2", "3", "4"];
