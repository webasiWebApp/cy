'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { Product } from '@/components/cards/ProductCard';
import GradientCircle from '@/components/ui/GradientCircle';
import { subscribeToProducts } from '@/lib/products';

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under LKR 2,000', min: 0, max: 1999 },
  { label: 'LKR 2,000 – 4,000', min: 2000, max: 4000 },
  { label: 'LKR 4,000 – 6,000', min: 4001, max: 6000 },
  { label: 'LKR 6,000+', min: 6001, max: Infinity },
];
const ITEMS_PER_PAGE = 6;

export default function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePriceIdx, setActivePriceIdx] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  /* ── Supabase real-time subscription ── */
  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToProducts((data) => {
      setProducts(data);
      setLoading(false);
      setFetchError('');
    });
    // subscribeToProducts doesn't expose error; add a safety timeout
    const timeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) setFetchError('Could not load products. Check your connection.');
        return false;
      });
    }, 12000);
    return () => { unsub(); clearTimeout(timeout); };
  }, []);

  /* ── Dynamic category list derived from live data ── */
  const ALL_CATEGORIES = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products],
  );

  const priceRange = PRICE_RANGES[activePriceIdx];

  /* ── Filtered products ── */
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesPrice = p.price >= priceRange.min && p.price <= priceRange.max;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [search, activeCategory, priceRange]);

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilterChange = useCallback((fn: () => void) => {
    fn();
    setCurrentPage(1);
  }, []);

  const pageNumbers = useMemo(() => {
    const nums: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (safePage > 3) nums.push('...');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        nums.push(i);
      }
      if (safePage < totalPages - 2) nums.push('...');
      nums.push(totalPages);
    }
    return nums;
  }, [totalPages, safePage]);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="relative min-h-screen bg-dark overflow-x-hidden">
        <div className="relative py-36 px-8 text-center border-b border-gold/10">
          <div className="h-3 w-40 bg-white/10 rounded mx-auto mb-5 animate-pulse" />
          <div className="h-14 w-72 bg-white/10 rounded mx-auto mb-6 animate-pulse" />
          <div className="h-3 w-80 bg-white/10 rounded mx-auto animate-pulse" />
        </div>
        <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-gold/10 rounded overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-3/4 bg-white/10 rounded" />
                <div className="h-2.5 w-full bg-white/[0.07] rounded" />
                <div className="h-2.5 w-5/6 bg-white/[0.07] rounded" />
                <div className="h-4 w-1/3 bg-gold/20 rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Error banner ── */
  if (fetchError) {
    return (
      <div className="relative min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <p className="font-italiana text-3xl text-white/30 mb-3">Oops</p>
          <p className="font-roboto text-sm text-white/40">{fetchError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-dark overflow-x-hidden">

      {/* ── Page Hero ── */}
      <div className="relative py-36 px-8 text-center overflow-hidden border-b border-gold/10">
        <GradientCircle image="circle" size={600} className="absolute left-1/2 -top-40 -translate-x-1/2 opacity-20 pointer-events-none" />
        <GradientCircle image="circle1" size={400} className="absolute -right-32 bottom-0 opacity-15 pointer-events-none" />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-roboto text-xs tracking-[0.4em] text-gold/70 uppercase mb-5"
        >
          HANDCRAFTED WITH LOVE
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-italiana text-5xl md:text-7xl text-white leading-[1.1]"
        >
          Our <span className="text-gold">Collection</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-roboto font-light text-white/55 text-sm md:text-base max-w-xl mx-auto mt-6 leading-relaxed"
        >
          Explore our curated range of handcrafted clay products — each piece a testament
          to Sri Lankan artisanship and natural materials.
        </motion.p>
        <motion.div
          className="mx-auto mt-8 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '120px', opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>

      {/* ── Controls Bar ── */}
      <div className="sticky top-[72px] z-30 bg-[rgba(9,9,10,0.9)] backdrop-blur-xl border-b border-gold/10 px-8 md:px-16 lg:px-24 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/50 pointer-events-none" />
            <input
              id="product-search"
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => handleFilterChange(() => setSearch(e.target.value))}
              className="w-full bg-[rgba(255,255,255,0.04)] border border-gold/15 text-white/80 placeholder:text-white/25
                font-roboto text-sm pl-10 pr-10 py-2.5 outline-none focus:border-gold/50 transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => handleFilterChange(() => setSearch(''))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="sm:hidden flex items-center gap-2 border border-gold/20 text-gold/70 font-roboto text-xs
              tracking-widest uppercase px-4 py-2.5 hover:border-gold/50 transition-colors duration-200"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Desktop filters inline */}
          <div className="hidden sm:flex items-center gap-2 flex-wrap">
            {/* Category */}
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(() => setActiveCategory(cat))}
                className={`font-roboto text-[10px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-gold text-dark border-gold'
                    : 'border-gold/15 text-white/50 hover:border-gold/40 hover:text-white/80'
                  }`}
              >
                {cat}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-gold/15 mx-1" />

            {/* Price */}
            <select
              id="price-filter"
              value={activePriceIdx}
              onChange={(e) => handleFilterChange(() => setActivePriceIdx(Number(e.target.value)))}
              className="bg-[rgba(255,255,255,0.04)] border border-gold/15 text-white/60 font-roboto text-[10px]
                tracking-wide uppercase px-4 py-2 outline-none cursor-pointer hover:border-gold/40
                transition-colors duration-200 appearance-none pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23EDBF7E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {PRICE_RANGES.map((r, i) => (
                <option key={i} value={i} className="bg-[#09090A] text-white/80">
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile filter dropdown */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="max-w-7xl mx-auto pt-4 pb-2 flex flex-col gap-4">
                {/* Category */}
                <div>
                  <p className="font-roboto text-[9px] tracking-[0.3em] text-white/30 uppercase mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleFilterChange(() => setActiveCategory(cat))}
                        className={`font-roboto text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-200
                          ${activeCategory === cat
                            ? 'bg-gold text-dark border-gold'
                            : 'border-gold/15 text-white/50 hover:border-gold/40'
                          }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price */}
                <div>
                  <p className="font-roboto text-[9px] tracking-[0.3em] text-white/30 uppercase mb-2">Price Range</p>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => handleFilterChange(() => setActivePriceIdx(i))}
                        className={`font-roboto text-[10px] tracking-wide uppercase px-3 py-1.5 border transition-all duration-200
                          ${activePriceIdx === i
                            ? 'bg-gold text-dark border-gold'
                            : 'border-gold/15 text-white/50 hover:border-gold/40'
                          }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Results summary ── */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 pt-10 pb-2 flex items-center justify-between">
        <p className="font-roboto text-xs text-white/30 tracking-wide">
          {filtered.length === 0
            ? 'No products found'
            : `Showing ${(safePage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of ${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
        </p>
        {(search || activeCategory !== 'All' || activePriceIdx !== 0) && (
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory('All');
              setActivePriceIdx(0);
              setCurrentPage(1);
            }}
            className="font-roboto text-[10px] tracking-widest uppercase text-gold/60 hover:text-gold transition-colors flex items-center gap-1.5"
          >
            <X size={11} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Product Grid ── */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-8">
        <AnimatePresence mode="wait">
          {paginated.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <p className="font-italiana text-3xl text-white/20 mb-3">No products found</p>
              <p className="font-roboto text-sm text-white/25">Try adjusting your search or filters.</p>
            </motion.div>
          ) : (
            <motion.div
              key={`page-${safePage}-${activeCategory}-${activePriceIdx}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 flex items-center justify-center gap-2"
          >
            {/* Prev */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex items-center gap-1.5 font-roboto text-[10px] tracking-[0.2em] uppercase border border-gold/15
                text-white/50 px-4 py-2.5 disabled:opacity-25 disabled:cursor-not-allowed
                hover:border-gold/50 hover:text-gold transition-all duration-200"
            >
              <ChevronLeft size={13} /> Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1.5">
              {pageNumbers.map((n, i) =>
                n === '...' ? (
                  <span key={`ellipsis-${i}`} className="text-white/25 font-roboto text-sm px-2">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n as number)}
                    className={`w-9 h-9 font-roboto text-xs tracking-wide border transition-all duration-200
                      ${safePage === n
                        ? 'bg-gold text-dark border-gold'
                        : 'border-gold/15 text-white/50 hover:border-gold/40 hover:text-white/80'
                      }`}
                  >
                    {n}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex items-center gap-1.5 font-roboto text-[10px] tracking-[0.2em] uppercase border border-gold/15
                text-white/50 px-4 py-2.5 disabled:opacity-25 disabled:cursor-not-allowed
                hover:border-gold/50 hover:text-gold transition-all duration-200"
            >
              Next <ChevronRight size={13} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
