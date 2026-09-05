"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/app/admin/actions";
import { parseImages } from "@/lib/utils";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  categoryId: string;
  slug: string;
  images: string;
  isActive: boolean;
  featured: boolean;
}

interface ProductFormProps {
  mode: "create" | "edit";
  product?: ProductData;
  categories: { id: string; name: string; slug: string }[];
}

export default function ProductForm({
  mode,
  product,
  categories,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>(
    product ? parseImages(product.images) : []
  );
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          setError("Each image must be under 5MB.");
          continue;
        }
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Upload failed");
        }

        const data = await res.json();
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.set("images", images.join(","));

    let result;
    if (mode === "create") {
      result = await createProductAction(formData);
    } else {
      formData.set("id", product!.id);
      result = await updateProductAction(formData);
    }

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
          <div className="mt-5 grid grid-cols-1 gap-4">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={product?.name}
                placeholder="e.g. Non-Stick Cooking Pot Set"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                required
                rows={5}
                defaultValue={product?.description}
                placeholder="Describe the product, features, and benefits..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Pricing</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Price (KES) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                defaultValue={product?.price}
                placeholder="e.g. 4500"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Compare-at Price (KES)</label>
              <input
                type="number"
                name="compareAtPrice"
                min="0"
                step="0.01"
                defaultValue={product?.compareAtPrice || ""}
                placeholder="Original price (optional)"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                defaultValue={product?.stock ?? 100}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SKU</label>
              <input
                type="text"
                name="sku"
                defaultValue={product?.sku || ""}
                placeholder="e.g. POT-001"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Organization</h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category *</label>
              <select name="categoryId" required defaultValue={product?.categoryId || ""} className={inputClass}>
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={product?.slug || ""}
                placeholder="Auto-generated if empty (e.g. non-stick-pot)"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Product Images</h2>
          <p className="mt-1 text-xs text-gray-500">
            Upload product photos (JPG, PNG, WebP — max 5MB each). The first
            image is the main one.
          </p>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div
                  key={img + i}
                  className={`group relative overflow-hidden rounded-lg border-2 ${
                    i === 0 ? "border-brand-600" : "border-gray-200"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Product image ${i + 1}`}
                    className="aspect-square w-full object-cover"
                  />
                  {i === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                      Main
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center transition hover:border-brand-500 hover:bg-brand-50">
              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 text-sm font-medium text-gray-700">
                {uploading ? "Uploading..." : "Click to upload images"}
              </span>
              <span className="text-xs text-gray-500">
                Select one or multiple images
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {images.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              No images uploaded yet. A placeholder will be shown until you add
              images.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Visibility</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Active (visible in store)
                </p>
                <p className="text-xs text-gray-500">
                  Hidden products won&apos;t show up for customers.
                </p>
              </div>
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={product?.isActive ?? true}
                className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
            </label>

            <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Featured product
                </p>
                <p className="text-xs text-gray-500">
                  Featured products appear on the homepage.
                </p>
              </div>
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="h-5 w-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || uploading}
            className="flex-1 rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Saving..."
              : mode === "create"
                ? "Create Product"
                : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}