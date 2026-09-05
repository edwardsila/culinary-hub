"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  category: { name: string; slug: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useStore();
  const firstImage = product.images.split(",")[0]?.trim() || null;

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-100">
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <svg className="h-16 w-16 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
            -{discount}%
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart({
              productId: product.id,
              name: product.name,
              price: product.price,
              image: firstImage || "",
              slug: product.slug,
            });
          }}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-200 hover:bg-brand-700 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/category/${product.category.slug}`}
          className="text-xs font-medium uppercase tracking-wide text-brand-600 hover:text-brand-700"
        >
          {product.category.name}
        </Link>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900 hover:text-brand-600"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}