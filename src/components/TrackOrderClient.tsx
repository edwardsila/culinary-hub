"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  deliveryMethod: string;
  deliveryAddress: string;
  city: string;
  total: number;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

const statusSteps = [
  { key: "pending", label: "Order Placed", desc: "We received your order" },
  { key: "confirmed", label: "Confirmed", desc: "Your order is confirmed" },
  { key: "processing", label: "Processing", desc: "Being packed and prepared" },
  { key: "shipped", label: "Shipped", desc: "Out for delivery" },
  { key: "delivered", label: "Delivered", desc: "Order delivered" },
  { key: "cancelled", label: "Cancelled", desc: "This order was cancelled" },
];

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders/track?number=${encodeURIComponent(orderNumber.trim())}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data.order);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Order not found. Please check your order number."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? statusSteps.findIndex((s) => s.key === order.status)
    : -1;

  if (order) {
    const statusColor = statusColors[order.status] || "bg-gray-100 text-gray-700";
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            setOrder(null);
            setOrderNumber("");
          }}
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Track another order
        </button>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order {order.orderNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-KE", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize ${statusColor}`}
            >
              {order.status}
            </span>
          </div>

          {/* Progress tracker */}
          <div className="mt-8">
            <div className="flex items-center">
              {statusSteps
                .filter((s) => s.key !== "cancelled")
                .map((step, i) => (
                  <div
                    key={step.key}
                    className={`flex items-center ${
                      i < statusSteps.filter((s) => s.key !== "cancelled").length - 1
                        ? "flex-1"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col items-center relative">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                          i <= currentStepIndex
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {i < currentStepIndex ? (
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span>{i + 1}</span>
                        )}
                      </div>
                      <div className="mt-2 w-24 text-center">
                        <p className={`text-xs font-semibold ${i <= currentStepIndex ? "text-brand-600" : "text-gray-400"}`}>
                          {step.label}
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400 hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                    {i <
                      statusSteps.filter((s) => s.key !== "cancelled").length - 1 && (
                      <div
                        className={`flex-1 border-t-2 ${
                          i < currentStepIndex ? "border-brand-600" : "border-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
            </div>

            {order.status === "cancelled" && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm font-medium text-red-700">
                  This order was cancelled. Please contact us if you have questions.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Delivery Details
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-gray-700 capitalize">
                  Method:{" "}
                  <span className="font-medium text-gray-900">
                    {order.deliveryMethod === "pickup" ? "Store Pickup" : "Courier"}
                  </span>
                </p>
                {order.deliveryMethod === "courier" && (
                  <>
                    <p className="text-gray-700">
                      Address:{" "}
                      <span className="font-medium text-gray-900">
                        {order.deliveryAddress}
                        {order.city ? `, ${order.city}` : ""}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                Order Summary
              </h2>
              <div className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name}{" "}
                      <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200 pt-2">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-brand-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <svg className="h-8 w-8 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Track Your Order
        </h1>
        <p className="mt-2 text-gray-500">
          Enter your order number to track its status and delivery progress.
        </p>
      </div>

      <form onSubmit={handleTrack} className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter order number e.g. CH-260905-1234"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-brand-600 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Tracking...
              </span>
            ) : (
              "Track Order"
            )}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </form>

      <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4">
        <h2 className="text-sm font-semibold text-gray-900">
          Where can I find my order number?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your order number was shown after checkout and sent to you via
          WhatsApp. It looks like{" "}
          <span className="font-mono text-gray-700">CH-260905-1234</span>.
        </p>
      </div>
    </div>
  );
}