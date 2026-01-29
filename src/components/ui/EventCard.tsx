import Link from "next/link";
import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

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
    <div
      className={`group relative p-6 rounded-2xl border transition-all duration-300 bg-black ${event.isPast ? "border-white/40 opacity-90 bg-black" : "border-white/20 hover:border-math-cyan bg-black"}`}
    >
      <span className="inline-block px-3 py-1 rounded-full bg-math-cyan/10 text-math-cyan text-xs font-bold uppercase mb-4">
        {event.category}
      </span>
      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-math-cyan transition-colors">
        {event.title}
      </h3>
      <p className="text-gray-400 text-sm mb-6 line-clamp-2">
        {event.description}
      </p>

      <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-300 mb-6 font-mono">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-math-cyan" />
          {formatDate(event.date)}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-math-cyan" />
          {event.time}
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <MapPin size={14} className="text-math-cyan" />
          {event.location}
        </div>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="block w-full py-3 px-4 bg-white text-black hover:bg-math-cyan rounded-lg font-bold text-sm uppercase text-center transition-all"
      >
        View Details <ArrowRight size={16} className="inline ml-2" />
      </Link>
    </div>
  );
}
