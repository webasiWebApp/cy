import type { Metadata } from 'next';
import Navbar from '@/components/sections/Navbar';
import ProductsPageContent from '@/components/sections/ProductsPageContent';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Products | CY International',
  description:
    'Browse our full collection of handcrafted clay planters, kitchenware, and decorative pieces — each made by skilled Sri Lankan artisans. Inquire via WhatsApp.',
};

export default function ProductsPage() {
  return (
    <main className="bg-dark overflow-x-hidden selection:bg-gold/30 selection:text-gold-light">
      <Navbar />
      <ProductsPageContent />
      <Footer />
    </main>
  );
}
