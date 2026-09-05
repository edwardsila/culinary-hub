import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import { storeConfig } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    }),
  ]);

  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-50 via-brand-100 to-amber-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                Kenya&apos;s Kitchen Store
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Premium Kitchen Utensils,{" "}
                <span className="text-brand-600">Delivered Fast</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-gray-600">
                From non-stick pots and pans to professional knives, we bring
                quality cookware to Kenyan kitchens. Order today and get free
                delivery on orders over KES{" "}
                {storeConfig.freeDeliveryThreshold.toLocaleString()}.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="rounded-lg bg-brand-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700"
                >
                  Shop Now
                </Link>
                <Link
                  href="/shop?sort=newest"
                  className="rounded-lg border-2 border-brand-600 bg-white px-8 py-3.5 text-base font-semibold text-brand-600 transition hover:bg-brand-50"
                >
                  New Arrivals
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brand-600/20 pt-6 max-w-md">
                <div>
                  <div className="text-2xl font-bold text-brand-600">
                    {categories.reduce((s, c) => s + c._count.products, 0)}+
                  </div>
                  <div className="text-xs font-medium text-gray-500">
                    Products
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600">47</div>
                  <div className="text-xs font-medium text-gray-500">
                    Counties served
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-600">24h</div>
                  <div className="text-xs font-medium text-gray-500">
                    Delivery
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 to-amber-500 shadow-2xl shadow-brand-600/30">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="h-48 w-48 text-white/90 drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/90 backdrop-blur p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Culinary Hub Collection
                      </p>
                      <p className="text-xs text-gray-500">
                        Premium quality cookware for every kitchen
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                      Shop Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              title: "Free Delivery",
              desc: `On orders over KES ${storeConfig.freeDeliveryThreshold.toLocaleString()}`,
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              ),
            },
            {
              title: "Quality Guaranteed",
              desc: "Tested, durable kitchen products",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
            },
            {
              title: "WhatsApp Ordering",
              desc: "Chat with us to order & pay",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              ),
            },
            {
              title: "Secure & Safe",
              desc: "M-Pesa & cash on delivery",
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              ),
            },
          ].map((badge) => (
            <div
              key={badge.title}
              className="flex items-start gap-3 rounded-xl border border-gray-200 p-4"
            >
              <div className="text-brand-600 shrink-0">{badge.icon}</div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {badge.title}
                </p>
                <p className="text-xs text-gray-500">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Shop by Category
            </h2>
            <p className="mt-2 text-gray-500">
              Everything you need for a modern kitchen
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative flex flex-col items-center overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-6 text-center transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-gray-900 group-hover:text-brand-600">
                {category.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {category._count.products} products
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Featured Products
            </h2>
            <p className="mt-2 text-gray-500">
              Handpicked bestsellers from our collection
            </p>
          </div>
          <Link
            href="/shop"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            View all &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                New Arrivals
              </h2>
              <p className="mt-2 text-gray-500">
                Fresh stock for your kitchen
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 px-8 py-12 sm:px-12 lg:px-16">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-16 right-20 h-64 w-64 rounded-full bg-white/10"></div>
          <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Upgrade Your Kitchen Today
              </h2>
              <p className="mt-2 max-w-xl text-brand-50">
                Browse our full collection of premium cookware and utensils.
                Order via WhatsApp for instant confirmation and fast delivery
                anywhere in Kenya.
              </p>
            </div>
            <Link
              href="/shop"
              className="shrink-0 rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}