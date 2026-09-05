"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { createSession, destroySession, getSession, verifyPassword } from "@/lib/auth";
import { z } from "zod";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return { error: "Invalid email or password" };

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) return { error: "Invalid email or password" };

  await createSession(admin.id);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0),
  compareAtPrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
  slug: z.string().optional(),
  images: z.string().optional(),
  isActive: z.union([z.boolean(), z.string()]).optional(),
  featured: z.union([z.boolean(), z.string()]).optional(),
});

function parseBool(value: string | boolean | undefined): boolean {
  if (value === undefined) return true;
  if (typeof value === "boolean") return value;
  return value === "on";
}

export async function createProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const raw = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    compareAtPrice: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    stock: Number(formData.get("stock") ?? 100),
    sku: String(formData.get("sku") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    slug: String(formData.get("slug") || ""),
    images: String(formData.get("images") || ""),
    isActive: parseBool(String(formData.get("isActive") || "on")),
    featured: parseBool(String(formData.get("featured") || "off")),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid product data" };
  }

  const data = parsed.data;
  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : slugify(data.name);

  // Ensure unique slug
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A product with this slug already exists" };
  }

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      sku: data.sku || null,
      categoryId: data.categoryId,
      slug,
      images: data.images || "",
      isActive: parseBool(data.isActive),
      featured: parseBool(data.featured),
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Product ID is required" };

  const raw = {
    name: String(formData.get("name") || ""),
    description: String(formData.get("description") || ""),
    price: Number(formData.get("price") || 0),
    compareAtPrice: formData.get("compareAtPrice")
      ? Number(formData.get("compareAtPrice"))
      : null,
    stock: Number(formData.get("stock") ?? 100),
    sku: String(formData.get("sku") || ""),
    categoryId: String(formData.get("categoryId") || ""),
    slug: String(formData.get("slug") || ""),
    images: String(formData.get("images") || ""),
    isActive: parseBool(String(formData.get("isActive") || "on")),
    featured: parseBool(String(formData.get("featured") || "off")),
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid product data" };
  }

  const data = parsed.data;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return { error: "Product not found" };

  const slug = data.slug?.trim()
    ? slugify(data.slug)
    : slugify(data.name);

  const slugConflict = await prisma.product.findUnique({ where: { slug } });
  if (slugConflict && slugConflict.id !== id) {
    return { error: "A product with this slug already exists" };
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      sku: data.sku || null,
      categoryId: data.categoryId,
      slug,
      images: data.images || "",
      isActive: parseBool(data.isActive),
      featured: parseBool(data.featured),
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.product.delete({ where: { id } }).catch(() => {
    // If product is referenced in orders, set null instead
  });

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function toggleProductActiveAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  const field = String(formData.get("field") || "isActive");

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;

  await prisma.product.update({
    where: { id },
    data:
      field === "featured"
        ? { featured: !product.featured }
        : { isActive: !product.isActive },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}
const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export async function createCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category data" };
  }

  const slug = parsed.data.slug?.trim()
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return { error: "A category with this slug already exists" };
  }

  await prisma.category.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || "",
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function updateCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Category ID is required" };

  const raw = {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
    description: String(formData.get("description") || ""),
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid category data" };
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) return { error: "Category not found" };

  const slug = parsed.data.slug?.trim()
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.name);

  const slugConflict = await prisma.category.findUnique({ where: { slug } });
  if (slugConflict && slugConflict.id !== id) {
    return { error: "A category with this slug already exists" };
  }

  await prisma.category.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description || "",
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") || "");
  if (!id) return { error: "Category ID is required" };

  await prisma.category.delete({ where: { id } });

  revalidatePath("/", "layout");
}
