"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ShopSortSelect({
  sort,
  category,
}: {
  sort: string;
  category: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(sort);

  const handleChange = (val: string) => {
    setValue(val);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    params.set("sort", val);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <select
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm focus:border-brand-500 focus:outline-none"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name: A-Z</option>
      </select>
    </div>
  );
}