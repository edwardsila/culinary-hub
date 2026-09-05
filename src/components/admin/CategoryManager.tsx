"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/actions";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count?: { products: number };
}

export default function CategoryManager({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(categories.length === 0);
  const [editing, setEditing] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";
  const labelClass = "mb-1.5 block text-sm font-medium text-gray-700";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    let result;
    if (editing) {
      formData.set("id", editing.id);
      result = await updateCategoryAction(formData);
    } else {
      result = await createCategoryAction(formData);
    }

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(editing ? "Category updated!" : "Category created!");
      setShowForm(false);
      setEditing(null);
      router.refresh();
      setTimeout(() => setSuccess(""), 3000);
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (
      !confirm(
        `Delete "${category.name}"? Products in this category will also be deleted.`
      )
    )
      return;

    setLoading(true);
    const formData = new FormData();
    formData.set("id", category.id);
    const result = await deleteCategoryAction(formData);
    if (result?.error) setError(result.error);
    router.refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {categories.length} category{categories.length !== 1 ? "ies" : ""}
        </p>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Category
        </button>
      </div>

      {(showForm || editing) && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-gray-200 bg-white p-6"
        >
          <h2 className="text-lg font-bold text-gray-900">
            {editing ? `Edit: ${editing.name}` : "New Category"}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Category Name *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={editing?.name}
                placeholder="e.g. Baking Essentials"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={editing?.slug}
                placeholder="Auto-generated if empty"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editing?.description}
                placeholder="Short description for this category"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : editing ? "Save Changes" : "Create Category"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setShowForm(false);
              }}
              className="rounded-lg border-2 border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Products
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">
                    {category.name}
                  </p>
                  {category.description && (
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                      {category.description}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-gray-600">
                    /category/{category.slug}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                    {category._count?.products || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(category);
                        setShowForm(true);
                      }}
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-brand-600 hover:text-brand-600"
                      title="Edit"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      disabled={loading}
                      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:border-red-500 hover:text-red-500"
                      title="Delete"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && !showForm && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  No categories yet. Click &quot;Add Category&quot; to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}