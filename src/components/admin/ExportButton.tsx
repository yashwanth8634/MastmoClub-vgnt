"use client";

import { Download } from "lucide-react";
import * as XLSX from "xlsx";

interface Registration {
  teamName?: string;
  members: {
    fullName: string;
    rollNo: string;
    branch: string;
    section: string;
    email: string;
    phone: string;
  }[];
}

export default function ExportButton({ data, eventTitle }: { data: any[], eventTitle: string }) {
  
  const handleExport = () => {
    // 1. Flatten Data (Convert nested members into rows)
    const flattenedData: any[] = [];

    data.forEach((reg: Registration) => {
      reg.members.forEach((member) => {
        flattenedData.push({
          "Team Name": reg.teamName || "Individual",
          "Full Name": member.fullName,
          "Roll Number": member.rollNo,
          "Branch": member.branch,
          "Section": member.section,
          "Email": member.email,
          "Phone": member.phone,
        });
      });
    });

    // 2. Sort Data (Branch -> Section -> Roll No)
    flattenedData.sort((a, b) => {
      if (a.Branch !== b.Branch) return a.Branch.localeCompare(b.Branch);
      if (a.Section !== b.Section) return a.Section.localeCompare(b.Section);
      return a["Roll Number"].localeCompare(b["Roll Number"]);
    });

    // 3. Create Worksheet
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

    // 4. Download File
    const fileName = `${eventTitle.replace(/\s+/g, "_")}_Registrations.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <button 
      onClick={handleExport}
      className="text-sm bg-[#00f0ff]/10 text-[#00f0ff] px-4 py-2 rounded-lg hover:bg-[#00f0ff]/20 flex items-center gap-2 transition-all font-bold"
    >
      <Download size={16} /> Export Excel
    </button>
  );
}