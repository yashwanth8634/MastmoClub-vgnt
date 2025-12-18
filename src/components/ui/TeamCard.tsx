import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, Instagram, User } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  details?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    email?: string;
    instagram?: string;
  };
}

export default function TeamCard({ member }: { member: TeamMemberProps }) {
  // Check if image is a valid path (starts with / or http)
  const hasValidImage = member.image && (member.image.startsWith("/") || member.image.startsWith("http"));

  return (
    <div className="group relative bg-black border border-white/40 rounded-xl p-6 hover:border-[#00f0ff]/50 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center">
      
      {/* 1. Circular Avatar */}
      <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white/30 group-hover:border-[#00f0ff] transition-colors bg-black/50 flex items-center justify-center">
        {hasValidImage ? (
          <Image 
            src={member.image} 
            alt={member.name}
            quality={65}
            decoding="async"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="text-gray-500 font-bold text-2xl group-hover:text-white">
            {member.name.charAt(0)}
          </div>
        )}
      </div>

      {/* 2. Name & Role */}
      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#00f0ff] transition-colors">
        {member.name}
      </h3>
      <p className="text-xs font-bold text-[#00f0ff] uppercase tracking-widest mb-2">
        {member.role}
      </p>

      {/* 3. Details (Roll No) */}
      {member.details && (
        <p className="text-xs font-mono text-gray-400 bg-white/5 px-2 py-1 rounded-md mb-3 border border-white/5">
          {member.details}
        </p>
      )}

      {/* 4. Social Icons */}
      <div className="flex gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
        {member.socials?.linkedin && (
          <Link href={member.socials.linkedin} target="_blank" className="hover:text-[#0077b5] transition-colors">
            <Linkedin size={16} />
          </Link>
        )}
        {member.socials?.github && (
          <Link href={member.socials.github} target="_blank" className="hover:text-white transition-colors">
            <Github size={16} />
          </Link>
        )}
        {member.socials?.email && (
          <Link href={`mailto:${member.socials.email}`} target="_blank" className="hover:text-[#00f0ff] transition-colors">
            <Mail size={16} />
          </Link>
        )}
        {member.socials?.instagram && (
          <Link href={member.socials.instagram} target="_blank" className="hover:text-[#E1306C] transition-colors">
            <Instagram size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}