import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Simple SVG Icons since lucide-react no longer includes brand icons
const LinkedinIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/-2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/-2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/-2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-dark-footer pt-20 pb-10 px-8 md:px-16 lg:px-24 border-t border-gold/10">
      <div className="max-w-7xl mx-auto">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Col 1 */}
          <div className="md:col-span-1 flex flex-col">
            <Link href="/" className="inline-block">
              <Image 
                src="/images/logo.png" 
                alt="CY International Logo" 
                width={50} 
                height={50} 
              />
            </Link>
            <h2 className="font-italiana text-gold text-lg mt-3">
              CY INTERNATIONAL
            </h2>
            <p className="font-roboto text-xs text-white/90 leading-relaxed mt-3 max-w-[200px]">
              Precision in Tradition. Building a sustainable future through crafted excellence across multiple industries.
            </p>
          </div>

          {/* Col 2 - COMPANY */}
          <div className="md:col-span-1">
            <h3 className="font-roboto text-xs tracking-[0.3em] uppercase text-white/40 mb-5">
              COMPANY
            </h3>
            <ul className="space-y-4">
              {['Privacy Policy', 'Terms of Service', 'Global Offices', 'Investor Relations'].map((link) => (
                <li key={link}>
                  <Link 
                    href="#" 
                    className="font-roboto text-sm text-white/60 hover:text-gold transition-colors block"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - CONNECT */}
          <div className="md:col-span-1">
            <h3 className="font-roboto text-xs tracking-[0.3em] uppercase text-white/40 mb-5">
              CONNECT
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="#" className="flex items-center gap-3 font-roboto text-sm text-white/60 hover:text-gold transition-colors">
                  <LinkedinIcon size={18} />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 font-roboto text-sm text-white/60 hover:text-gold transition-colors">
                  <InstagramIcon size={18} />
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center gap-3 font-roboto text-sm text-white/60 hover:text-gold transition-colors">
                  <FacebookIcon size={18} />
                  Facebook
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-roboto text-[10px] text-white/90 tracking-widest text-center md:text-left">
            © 2025 CY INTERNATIONAL. PRECISION IN TRADITION.
          </p>
          <p className="font-roboto text-[10px] text-white/90 tracking-widest text-center md:text-right">
            CRAFTED BY PRABLO 360
          </p>
        </div>

      </div>
    </footer>
  );
}
