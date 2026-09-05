"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { storeConfig } from "@/lib/store";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryMethod: "courier",
    address: "",
    city: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (cart.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-gray-500">
            Add some products before checking out.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee =
    cartTotal >= storeConfig.freeDeliveryThreshold ? 0 : storeConfig.deliveryFee;
  const total = cartTotal + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name || !form.phone) {
      setError("Please fill in your name and phone number.");
      setLoading(false);
      return;
    }

    if (form.deliveryMethod === "courier" && !form.address) {
      setError("Please provide your delivery address.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart,
          subtotal: cartTotal,
          deliveryFee,
          total,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to place order");
      }

      const data = await res.json();

      // Open WhatsApp with order details
      const lines = [
        `*New Order: ${data.orderNumber}*`,
        "",
        `*Customer:* ${form.name}`,
        `*Phone:* ${form.phone}`,
        form.email ? `*Email:* ${form.email}` : null,
        `*Delivery:* ${
          form.deliveryMethod === "pickup" ? "Store Pickup" : "Courier"
        }`,
        form.deliveryMethod === "courier"
          ? `*Address:* ${form.address}, ${form.city || "Kenya"}`
          : null,
        "",
        "*Items:*",
        ...cart.map(
          (i, idx) =>
            `${idx + 1}. ${i.name} x${i.quantity} = ${formatPrice(
              i.price * i.quantity
            )}`
        ),
        "",
        `*Subtotal:* ${formatPrice(cartTotal)}`,
        `*Delivery:* ${
          deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)
        }`,
        `*Total:* ${formatPrice(total)}`,
        form.notes ? `*Notes:* ${form.notes}` : null,
      ].filter(Boolean);

      const waMessage = lines.join("\n");

      window.open(
        `https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(
          waMessage
        )}`,
        "_blank"
      );

      clearCart();
      router.push(`/order-confirmed?order=${data.orderNumber}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again."
      );
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="mt-2 text-gray-500">
          Complete your order. We&apos;ll confirm via WhatsApp right away.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                1. Personal Details
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. John Kamau"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone Number * (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="e.g. 0712 345 678"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="e.g. john@email.com"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                2. Delivery Method
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, deliveryMethod: "courier" })
                  }
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                    form.deliveryMethod === "courier"
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      form.deliveryMethod === "courier"
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {form.deliveryMethod === "courier" && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Courier Delivery
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Delivered to your address.{" "}
                      {deliveryFee === 0
                        ? "FREE"
                        : formatPrice(storeConfig.deliveryFee)}{" "}
                      charge.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setForm({ ...form, deliveryMethod: "pickup" })
                  }
                  className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition ${
                    form.deliveryMethod === "pickup"
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      form.deliveryMethod === "pickup"
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {form.deliveryMethod === "pickup" && (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Store Pickup (Free)
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Pick up from {storeConfig.location}
                    </p>
                  </div>
                </button>
              </div>

              {form.deliveryMethod === "courier" && (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Delivery Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="e.g. House No, Street, Estate"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      placeholder="e.g. Nairobi"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-bold text-gray-900">
                3. Additional Notes
              </h2>
              <div className="mt-4">
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  rows={3}
                  placeholder="Any special instructions for your order? (optional)"
                  className={inputClass}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-brand-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Placing order...
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Place Order via WhatsApp
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500">
              You&apos;ll be redirected to WhatsApp to confirm your order with
              the seller.
            </p>
          </form>

          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-brand-50">
                          <svg className="h-5 w-5 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <dl className="mt-5 space-y-3 border-t border-gray-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Subtotal</dt>
                  <dd className="font-semibold text-gray-900">
                    {formatPrice(cartTotal)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Delivery</dt>
                  <dd
                    className={`font-semibold ${
                      deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                  <dt className="font-bold text-gray-900">Total</dt>
                  <dd className="font-bold text-brand-600">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}