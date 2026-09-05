"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    images: string[];
    description: string;
    stock: number;
  };
  discount: number;
}

export default function ProductDetailClient({
  product,
  discount,
}: ProductDetailClientProps) {
  const { addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.images.length > 0 ? product.images : [null];

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || "",
        slug: product.slug,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <div className="relative aspect-square">
          {images[selectedImage] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
              <svg className="h-32 w-32 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
          {discount > 0 && (
            <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-sm font-semibold text-white shadow">
              -{discount}%
            </span>
          )}
        </div>
      </div>

      {product.images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`h-20 w-20 overflow-hidden rounded-lg border-2 transition ${
                selectedImage === i
                  ? "border-brand-600"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={product.name} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-gray-300">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2.5 text-gray-500 hover:text-brand-600"
              aria-label="Decrease quantity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-10 text-center text-lg font-semibold">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="px-4 py-2.5 text-gray-500 hover:text-brand-600"
              aria-label="Increase quantity"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`flex-1 rounded-lg px-6 py-3 text-base font-semibold text-white transition ${
              product.stock <= 0
                ? "cursor-not-allowed bg-gray-300"
                : added
                  ? "bg-green-600"
                  : "bg-brand-600 hover:bg-brand-700"
            }`}
          >
            {added
              ? "Added to Cart!"
              : product.stock <= 0
                ? "Out of Stock"
                : `Add to Cart — ${formatPrice(product.price * quantity)}`}
          </button>
        </div>
      </div>
    </div>
  );
}