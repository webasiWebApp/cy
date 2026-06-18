import React from 'react';
import Link from 'next/link';

interface InsightCardProps {
  category: string;    // e.g. "CRAFTSMANSHIP"
  title: string;
  review: string;      // excerpt / review text
  date: string;        // e.g. "Apr 2025"
  featured?: boolean;
}

export default function InsightCard({ category, title, review, date, featured }: InsightCardProps) {
  return (
    <div className="group flex flex-col bg-transparent border border-white/8 hover:border-gold/30 transition-all duration-300 p-7 w-[340px] shrink-0 hover:-translate-y-1">
      {/* Top */}
      <div className="flex justify-between items-center w-full">
        <span className="font-roboto text-[10px] tracking-[0.3em] text-gold uppercase">
          {category}
        </span>
        <span className="font-roboto text-[10px] text-white/30">
          {date}
        </span>
      </div>

      {/* Body */}
      <div className="mt-5 flex-1 flex flex-col">
        <h3 className="font-italiana text-xl text-white leading-snug mb-3 line-clamp-2">
          {title}
        </h3>
        <p className="font-roboto text-xs text-white/55 leading-relaxed line-clamp-4">
          {review}
        </p>
      </div>

      {/* Bottom */}
      <div className="mt-6 pt-5 border-t border-white/8 flex items-center">
        <Link 
          href="#" 
          className="font-roboto text-xs tracking-widest text-gold/70 hover:text-gold transition-colors inline-flex items-center"
        >
          READ MORE <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </Link>
      </div>
    </div>
  );
}
