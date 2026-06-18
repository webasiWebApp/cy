import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode; // Using ReactNode to allow <em> inside the title
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', className }: SectionHeadingProps) {
  const alignmentClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={cn("flex flex-col", alignmentClass, className)}>
      {eyebrow && (
        <span className="font-roboto text-xs tracking-[0.3em] uppercase text-gold/70 mb-3">
          {eyebrow}
        </span>
      )}
      
      <h2 className="font-italiana text-4xl md:text-5xl lg:text-6xl text-white leading-tight [&>em]:font-italiana [&>em]:not-italic [&>em]:text-gold">
        {title}
      </h2>
      
      {subtitle && (
        <p className={cn("font-roboto font-light text-white/60 text-base max-w-xl leading-relaxed mt-4", align === 'center' ? 'mx-auto' : '')}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
