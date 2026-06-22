import React from 'react';
import Image from 'next/image';

interface SectorCardProps {
  index: string;       // "01", "02", etc.
  image: string;       // path to sector image e.g. "sector1.png"
  title: string;
  description: string;
}

export default function SectorCard({ index, image, title, description }: SectorCardProps) {
  return (
    <div className="group relative overflow-hidden w-[340px] h-[420px] shrink-0 bg-dark-footer">
      <Image 
        src={`/images/${image}`} 
        alt={title}
        fill 
        sizes="340px"
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-600 ease-in-out group-hover:scale-[1.06]"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,10,0.95)_0%,rgba(9,9,10,0.3)_50%,transparent_100%)] group-hover:bg-[linear-gradient(to_top,rgba(9,9,10,0.98)_0%,rgba(9,9,10,0.4)_50%,transparent_100%)] transition-colors duration-400" />

      {/* Gold Left Border Reveal */}
      <div className="absolute left-0 bottom-0 w-[2px] h-full bg-gold scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-400 ease-in-out z-20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-7 z-10 w-full flex flex-col">
        <span className="font-roboto text-xs tracking-[0.3em] text-gold/60 mb-3 block">
          {index}
        </span>
        
        <h3 className="font-italiana text-2xl text-white mb-2">
          {title}
        </h3>
        
        <p className="font-roboto text-xs text-white/55 leading-relaxed line-clamp-3 translate-y-[10px] opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-in-out">
          {description}
        </p>
      </div>
    </div>
  );
}
