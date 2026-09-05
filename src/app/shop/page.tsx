import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ProductCard from "@/components/ProductCard";
import ShopSortSelect from "@/components/ShopSortSelect";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shop",
  description: "Browse all our premium kitchen utensils and cookware.",
};

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = (params.category as string) || "all";
  const search = (params.q as string) || "";
  const sort = (params.sort as string) || "newest";
  const minPrice = params.min ? Number(params.min) : null;
  const maxPrice = params.max ? Number(params.max) : null;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
  });

  const where: Prisma.ProductWhereInput = { isActive: true };
  if (category !== "all") where.category = { slug: category };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }
  if (minPrice !== null || maxPrice !== null) {
    where.price = {};
    if (minPrice !== null) where.price.gte = minPrice;
    if (maxPrice !== null) where.price.lte = maxPrice;
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { price: "asc" }
      : sort === "price-desc"
        ? { price: "desc" }
        : sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });

  return (
    <div className="bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <nav className="flex text-sm">
            <Link href="/" className="text-gray-500 hover:text-brand-600">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-medium">Shop</span>
          </nav>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Our Products
          </h1>
          <p className="mt-1 text-gray-500">
            {products.length} products found
            {search ? ` for "${search}"` : ""}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters sidebar */}
          <aside className="hidden lg:block">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Categories
              </h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      category === "all"
                        ? "bg-brand-50 font-semibold text-brand-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    All Products
                    <span className="float-right text-xs text-gray-400">
                      {categories.reduce((s, c) => s + c._count.products, 0)}
                    </span>
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/shop?category=${c.slug}`}
                      className={`block rounded-lg px-3 py-2 text-sm ${
                        category === c.slug
                          ? "bg-brand-50 font-semibold text-brand-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {c.name}
                      <span className="float-right text-xs text-gray-400">
                        {c._count.products}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                Price Range
              </h2>
              <div className="mt-4 space-y-3">
                {[
                  { label: "Under KES 2,000", min: 0, max: 2000 },
                  { label: "KES 2,000 - 4,000", min: 2000, max: 4000 },
                  { label: "KES 4,000 - 6,000", min: 4000, max: 6000 },
                  { label: "Over KES 6,000", min: 6000, max: null },
                ].map((range) => (
                  <Link
                    key={range.label}
                    href={`/shop?category=${category}${range.min !== null ? `&min=${range.min}` : ""}${range.max !== null ? `&max=${range.max}` : ""}`}
                    className={`block rounded-lg px-3 py-2 text-sm ${
                      minPrice === range.min && maxPrice === range.max
                        ? "bg-brand-50 font-semibold text-brand-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {/* Sort controls */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {products.length}
                </span>{" "}
                products
              </p>
              <ShopSortSelect sort={sort} category={category} />
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No products found
                </h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your filters or search terms.
                </p>
                <Link
                  href="/shop"
                  className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}