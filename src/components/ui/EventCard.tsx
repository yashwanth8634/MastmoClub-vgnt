import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";

interface EventProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  description: string;
  isPast?: boolean;
}

export default function EventCard({ event }: { event: EventProps }) {
  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 bg-black
      ${event.isPast 
        ? "border-white/10 opacity-80 hover:opacity-100 hover:border-white/30" // Past: Black bg, subtle border
        : "border-white/20 hover:border-[#00f0ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] hover:-translate-y-1" // Upcoming: Black bg, glow effect
      }`}>
      
      {/* Category Badge */}
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4
        ${event.isPast ? "bg-white/10 text-gray-400" : "bg-[#00f0ff]/10 text-[#00f0ff]"}`}>
        {event.category}
      </span>

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        {event.description}
      </p>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-300 mb-6 font-mono">
        <div className="flex items-center gap-2">
          <Calendar size={14} className={event.isPast ? "text-gray-500" : "text-[#00f0ff]"} />
          {event.date}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className={event.isPast ? "text-gray-500" : "text-[#00f0ff]"} />
          {event.time}
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <MapPin size={14} className={event.isPast ? "text-gray-500" : "text-[#00f0ff]"} />
          {event.location}
        </div>
      </div>

      {/* Button */}
      <Link 
        href={`/events/${event.id}`} 
        className={`block w-full py-3 px-4 rounded-lg font-bold text-sm uppercase tracking-wide transition-all text-center
          ${event.isPast 
            ? "border border-gray-400 text-gray-300 hover:bg-gray-400 hover:text-black" 
            : "bg-white text-black hover:bg-[#00f0ff] hover:text-black"}`}
      >
        {event.isPast ? "View Recap" : "View Details"} <ArrowRight size={16} className="inline ml-2" />
      </Link>
    </div>
  );
}