import React, { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'outline';
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  className?: string;
}

export default function Button({ label, variant, onClick, href, icon, className }: ButtonProps) {
  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-roboto font-medium uppercase text-xs px-7 py-3 transition-all duration-400 ease-in-out border border-transparent";
  
  const primaryClasses = "bg-gold-gradient text-dark-footer tracking-widest hover:tracking-[0.2em] hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(237,191,126,0.35)]";
  const primaryBefore = "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,#C9A870_0%,#EDBF7E_100%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400 before:ease-[cubic-bezier(0.4,0,0.2,1)]";
  
  const outlineClasses = "bg-transparent border-gold text-gold tracking-widest hover:tracking-[0.2em] hover:scale-[1.02] hover:text-dark-footer hover:shadow-[0_8px_30px_rgba(237,191,126,0.35)]";
  const outlineBefore = "before:absolute before:inset-0 before:bg-gold-gradient before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-400 before:ease-[cubic-bezier(0.4,0,0.2,1)]";

  const isPrimary = variant === 'primary';
  const combinedClasses = cn(
    baseClasses,
    isPrimary ? primaryClasses : outlineClasses,
    isPrimary ? primaryBefore : outlineBefore,
    className
  );

  const content = (
    <>
      <span className="relative z-10">{label}</span>
      {icon && <span className="relative z-10 ml-2">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} onClick={onClick}>
      {content}
    </button>
  );
}
