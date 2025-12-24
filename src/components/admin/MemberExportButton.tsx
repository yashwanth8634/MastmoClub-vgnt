"use client";

import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, FileText } from "lucide-react";

interface Member {
  name: string;
  rollNumber: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  section: string;
}

// ✅ Added 'title' and 'fileName' props
export default function MemberExportButton({ 
  members, 
  title = "MASTMO CLUB - REGISTRY", 
  fileName = "Report" 
}: { 
  members: Member[], 
  title?: string, 
  fileName?: string 
}) {

  const generatePDF = () => {
    const doc = new jsPDF();

    // 1. SORTING (Year > Branch > Section > Roll No)
    const sortedMembers = [...members].sort((a, b) => {
      if (a.year !== b.year) return a.year.localeCompare(b.year);
      if (a.branch !== b.branch) return a.branch.localeCompare(b.branch);
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      return a.rollNumber.localeCompare(b.rollNumber);
    });

    // 2. HEADER
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(18);
    doc.text(title, pageWidth / 2, 15, { align: "center" }); // ✅ Dynamic Title
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 22, { align: "center" });
    doc.text(`Total Participants: ${members.length}`, pageWidth / 2, 27, { align: "center" });

    // 3. TABLE
    const tableRows = sortedMembers.map((m, index) => [
      index + 1,
      m.rollNumber.toUpperCase(),
      m.name,
      `${m.year}-${m.branch}-${m.section}`,
      m.phone,
      m.email
    ]);

    autoTable(doc, {
      head: [["S.No", "Roll No", "Name", "Class", "Phone", "Email"]],
      body: tableRows,
      startY: 35,
      theme: "grid",
      headStyles: { fillColor: [0, 240, 255], textColor: [0, 0, 0], fontStyle: "bold", halign: "center" },
      columnStyles: { 0: { halign: "center", cellWidth: 15 }, 3: { halign: "center" } },
    });

    doc.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 px-4 py-2 bg-[#00f0ff] hover:bg-white text-black font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
    >
      <FileText size={18} />
      Export PDF
    </button>
  );
}