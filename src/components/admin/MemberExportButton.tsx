"use client";

import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Member {
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  section: string;
}

interface ExportProps {
  members: Member[];
  title?: string;
  fileName?: string;
}

export default function MemberExportButton({ 
  members, 
  title = "Club Members", 
  fileName = "Members_List" 
}: ExportProps) {

  const generatePDF = () => {
    const doc = new jsPDF();

    // 1. Sort Data: Year > Branch > Section > RollNo
    const sortedMembers = [...members].sort((a, b) => {
      if (a.year !== b.year) return a.year.localeCompare(b.year);
      if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.rollNumber.localeCompare(b.rollNumber);
    });

    // 2. Prepare Table Data with Group Headers
    const tableBody: any[] = [];
    let lastGroup = "";
    let serialNo = 1;

    sortedMembers.forEach((m) => {
      // ✅ FORMAT: "1st Year CSE A"
      const currentGroup = `${m.year} Year ${m.branch} ${m.section}`;

      // If group changes, insert a Header Row
      if (currentGroup !== lastGroup) {
        tableBody.push([
          { 
            content: currentGroup.toUpperCase(), // e.g., "1ST YEAR CSE A"
            colSpan: 6, 
            styles: { 
              fillColor: [200, 200, 200], // Light Gray background
              textColor: [0, 0, 0],       // Black Text
              fontStyle: "bold",
              halign: "left",
              fontSize: 10
            } 
          }
        ]);
        lastGroup = currentGroup;
      }

      // Insert Student Row
      tableBody.push([
        serialNo++,
        m.rollNumber,
        m.name,
        m.phone,
        m.email,
        "" // Attendance Column
      ]);
    });

    // 3. Document Title
    doc.setFontSize(16);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

    // 4. Generate Table
    autoTable(doc, {
      startY: 35,
      head: [["S.No", "Roll No", "Name", "Phone", "Email", "Sign"]],
      body: tableBody,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 12 }, 
        1: { cellWidth: 30 }, // Roll No
        2: { cellWidth: 50 }, // Name
        3: { cellWidth: 30 }, // Phone
        4: { cellWidth: 45 }, // Email
        5: { cellWidth: 20 }  // Sign
      }
    });

    // 5. Save File
    doc.save(`${fileName}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 bg-[#00f0ff] text-black px-4 py-2 rounded-lg font-bold hover:bg-white hover:scale-105 transition-all text-sm"
    >
      <Download size={16} /> Export PDF
    </button>
  );
}