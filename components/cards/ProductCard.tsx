'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export interface Product {
  id?: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  whatsappMessage: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

const WHATSAPP_NUMBER = '94786677891';

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(product.whatsappMessage)}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative flex flex-col bg-[rgba(255,255,255,0.02)] border border-gold/10 overflow-hidden
        hover:border-gold/30 hover:bg-[rgba(255,255,255,0.04)] transition-all duration-500"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-dark-footer">
        <Image
          src={product.image?.startsWith('http') ? product.image : `/images/${product.image}`}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-700 ease-in-out group-hover:scale-[1.07]"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,9,10,0.7)] via-transparent to-transparent" />

        {/* Category badge */}
        <span className="absolute top-4 left-4 font-roboto text-[9px] tracking-[0.3em] uppercase text-gold/80 bg-[rgba(9,9,10,0.75)] backdrop-blur-sm border border-gold/20 px-3 py-1.5">
          {product.category}
        </span>

        {/* Gold left-border reveal */}
        <div className="absolute left-0 bottom-0 w-[2px] h-full bg-gold scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-in-out z-10" />
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-3">

        {/* Name */}
        <h3 className="font-italiana text-xl text-white leading-snug group-hover:text-gold transition-colors duration-300 line-clamp-2">
          {product.name}
        </h3>

        {/* Description */}
        <p className="font-roboto font-light text-white/50 text-xs leading-6 line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold/10">
          <div>
            <p className="font-roboto text-[10px] tracking-[0.2em] text-white/35 uppercase mb-0.5">Price</p>
            <p className="font-italiana text-2xl text-gold leading-none">
              LKR {product.price.toLocaleString()}
            </p>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Inquire about ${product.name} on WhatsApp`}
            className="group/btn relative inline-flex items-center gap-2 overflow-hidden border border-gold/40
              bg-transparent text-gold font-roboto text-[10px] tracking-[0.2em] uppercase px-4 py-2.5
              hover:text-dark hover:border-gold transition-colors duration-300
              before:absolute before:inset-0 before:bg-gold before:origin-left before:scale-x-0
              hover:before:scale-x-100 before:transition-transform before:duration-300 before:ease-in-out"
          >
            <MessageCircle size={13} className="relative z-10 shrink-0" />
            <span className="relative z-10">Inquire</span>
          </a>
        </div>
      </div>

      {/* Corner accent lines */}
      <div className="absolute top-0 right-0 w-8 h-px bg-gold/30" />
      <div className="absolute top-0 right-0 w-px h-8 bg-gold/30" />
    </motion.article>
  );
}
