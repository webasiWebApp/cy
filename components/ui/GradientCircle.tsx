import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface GradientCircleProps {
  image: 'circle' | 'circle1';
  size: number;
  className?: string;
  opacity?: number;
}

export default function GradientCircle({ image, size, className, opacity = 0.6 }: GradientCircleProps) {
  return (
    <div 
      className={cn("absolute pointer-events-none select-none blur-[2px]", className)}
      style={{ opacity, width: size, height: size }}
    >
      <Image 
        src={`/images/${image}.png`} 
        alt="Decorative background glow" 
        fill 
        style={{ objectFit: 'contain' }} 
        priority={false}
      />
    </div>
  );
}
