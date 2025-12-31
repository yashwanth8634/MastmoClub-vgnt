"use client";

import { useState, Fragment } from "react"; 
import { ChevronDown, ChevronRight, User } from "lucide-react";
import MemberExportButton from "@/components/admin/MemberExportButton";

export default function EventRegistrationsList({ events }: { events: any[] }) {
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const toggleEvent = (id: string) => {
    setExpandedEventId(prev => (prev === id ? null : id));
  };

  const toggleTeam = (uniqueId: string) => {
    setExpandedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(uniqueId)) newSet.delete(uniqueId);
      else newSet.add(uniqueId);
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const isEventOpen = expandedEventId === event.id;

        return (
          <div 
            key={event.id} 
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isEventOpen 
                ? "bg-white/5 border-white/20 shadow-2xl" 
                : "bg-white/5 border-white/10 hover:border-white/20"
            }`}
          >
            {/* HEADER */}
            <button
              onClick={() => toggleEvent(event.id)}
              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full transition-transform duration-200 ${isEventOpen ? "bg-[#00f0ff] text-black rotate-90" : "bg-white/10 text-white"}`}>
                   <ChevronRight size={20} />
                </div>
                <div>
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${isEventOpen ? "text-[#00f0ff]" : "text-white"}`}>
                    {event.title}
                    {!event.isOpen && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase">Closed</span>}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {event.teamCount} Teams • {event.studentCount} Participants
                  </p>
                </div>
              </div>
            </button>

            {/* EXPANDED CONTENT */}
            {isEventOpen && (
              <div className="p-6 pt-0 border-t border-white/10 animate-in slide-in-from-top-2">
                
                {/* 🖨️ EXPORT BUTTONS */}
                <div className="flex flex-wrap gap-4 py-6 justify-end">
                    <div className="flex items-center gap-4 bg-black/40 p-3 rounded-xl border border-white/10">
                        
                        {/* 1. TEAM REPORT BUTTON */}
                        <div className="flex items-center gap-2">
                            <MemberExportButton 
                              members={event.teamReportData} // Pass the "Hacked" Data
                              title={`TEAM LIST: ${event.title}`}
                              fileName={`Teams_${event.title}`}
                            />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white uppercase">Team List</span>
                                <span className="text-[10px] text-gray-500">Grouped by Teams</span>
                            </div>
                        </div>
                        
                        <div className="w-px h-8 bg-white/20"></div>

                        {/* 2. CLASS REPORT BUTTON */}
                        <div className="flex items-center gap-2">
                            <MemberExportButton 
                              members={event.classReportData} // Pass the Real Data
                              title={`CLASS REPORT: ${event.title}`}
                              fileName={`ClassWise_${event.title}`}
                            />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#00f0ff] uppercase">Class List</span>
                                <span className="text-[10px] text-gray-500">Grouped by Year</span>
                            </div>
                        </div>

                    </div>
                </div>

                {/* TABLE (Standard View) */}
                <div className="overflow-x-auto bg-black/40 rounded-xl border border-white/5 max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs sticky top-0 bg-black z-10">
                      <tr>
                        <th className="p-4">Team Name</th>
                        <th className="p-4">Lead Name</th>
                        <th className="p-4">Roll No</th>
                        <th className="p-4">Section</th>
                        <th className="p-4 text-right">Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {event.registrations.map((reg: any) => {
                        const uniqueTeamId = `${event.id}-${reg._id}`;
                        const isTeamExpanded = expandedTeams.has(uniqueTeamId);
                        const hasMembers = reg.teamMembers && reg.teamMembers.length > 0;

                        return (
                          <Fragment key={reg._id}>
                            <tr className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  {hasMembers ? (
                                    <button 
                                      onClick={() => toggleTeam(uniqueTeamId)}
                                      className={`p-1 rounded hover:bg-white/20 transition-transform ${isTeamExpanded ? "rotate-180 text-[#00f0ff]" : "text-gray-400"}`}
                                    >
                                      <ChevronDown size={16} />
                                    </button>
                                  ) : <span className="w-6 h-6 inline-block" />}
                                  
                                  <span className={`font-bold ${isTeamExpanded ? "text-[#00f0ff]" : "text-gray-300"}`}>
                                    {reg.teamName || "Individual"}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4 text-white flex items-center gap-2">
                                {reg.fullName} 
                                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded">Lead</span>
                              </td>
                              <td className="p-4 font-mono text-gray-400">{reg.rollNo}</td>
                              <td className="p-4 text-gray-400">{reg.section || "-"}</td>
                              <td className="p-4 text-right font-mono text-gray-500">
                                {1 + (reg.teamMembers?.length || 0)}
                              </td>
                            </tr>
                            {isTeamExpanded && hasMembers && (
                              <tr className="bg-white/[0.02]">
                                <td colSpan={5} className="p-0">
                                  <div className="pl-12 pr-4 py-3 border-l-2 border-[#00f0ff] ml-8 my-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Members</p>
                                    <div className="grid gap-2">
                                      {reg.teamMembers.map((m: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between bg-black/40 p-2 rounded text-sm">
                                          <span className="text-gray-200">{m.name}</span>
                                          <span className="text-gray-400 font-mono text-xs">{m.rollNo}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}