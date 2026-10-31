import type { IProduct } from '@/types';
import ProductCard from './ProductCard';

interface Props {
  products: IProduct[];
}

export default function FeaturedProducts({ products }: Props) {
  const featured = products.slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between mb-8">
          <h2 class="flex items-center gap-2 font-display font-bold text-2xl sm:text-3xl text-gray-800">
            <svg class="size-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span>Destacados</span>
          </h2>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} currentPath="/" />
          ))}
        </div>
      </div>
    </section>
  );
}