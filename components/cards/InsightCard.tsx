import React from 'react';
import { User } from 'lucide-react';

interface InsightCardProps {
  name: string;
  review: string;
}

export default function InsightCard({ name, review }: InsightCardProps) {
  return (
    <div className="h-full group flex flex-col bg-transparent border border-white/8 hover:border-gold/30 transition-all duration-300 p-7 w-[350px] shrink-0 hover:-translate-y-1">
      {/* Top: Avatar and Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gold shrink-0">
          <User size={24} strokeWidth={1.5} />
        </div>
        <h3 className="font-italiana text-lg text-white leading-snug">
          {name}
        </h3>
      </div>

      {/* Body: Review */}
      <div className="flex-1 flex flex-col">
        <p className="font-roboto text-sm text-white/70 leading-relaxed italic">
          "{review}"
        </p>
      </div>
    </div>
  );
}
