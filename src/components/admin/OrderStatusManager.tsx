"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  items: OrderItem[];
}

const statusOptions = [
  { key: "pending", label: "Pending", color: "bg-amber-500" },
  { key: "confirmed", label: "Confirmed", color: "bg-blue-500" },
  { key: "processing", label: "Processing", color: "bg-purple-500" },
  { key: "shipped", label: "Shipped", color: "bg-indigo-500" },
  { key: "delivered", label: "Delivered", color: "bg-green-500" },
  { key: "cancelled", label: "Cancelled", color: "bg-red-500" },
];

export default function OrderStatusManager({ order }: { order: Order }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const currentIndex = statusOptions.findIndex((s) => s.key === order.status);

  const updateStatus = async (status: string) => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/orders/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });

    if (res.ok) {
      setMessage(`Order status updated to "${status}".`);
      router.refresh();
    } else {
      setMessage("Failed to update status.");
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900">
          Order Status & Tracking
        </h2>
        <span className="text-sm text-gray-500 capitalize">
          Current: <strong className="text-gray-900">{order.status}</strong>
        </span>
      </div>

      {/* Progress steps */}
      <div className="mt-6">
        <div className="flex items-center">
          {statusOptions
            .filter((s) => s.key !== "cancelled")
            .map((step, i) => (
              <div
                key={step.key}
                className={`flex items-center ${
                  i < statusOptions.filter((s) => s.key !== "cancelled").length - 1
                    ? "flex-1"
                    : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${
                      i <= currentIndex && order.status !== "cancelled"
                        ? step.color
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-medium ${
                      i <= currentIndex && order.status !== "cancelled"
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {i <
                  statusOptions.filter((s) => s.key !== "cancelled").length - 1 && (
                  <div
                    className={`flex-1 border-t-2 ${
                      i < currentIndex && order.status !== "cancelled"
                        ? "border-brand-600"
                        : "border-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
        </div>

        {currentIndex >= 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => updateStatus(option.key)}
                disabled={loading || option.key === order.status}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition disabled:cursor-not-allowed ${
                  option.key === order.status
                    ? `${option.color} text-white`
                    : "border border-gray-300 text-gray-700 hover:border-gray-500"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        {message && (
          <p className="mt-3 text-sm text-gray-700">{message}</p>
        )}
        {loading && (
          <p className="mt-3 text-sm text-gray-400">Updating...</p>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Order total:{" "}
          <strong className="text-gray-900">{formatPrice(order.total)}</strong>
          {" "}&middot;{" "}
          {order.items.reduce((s, i) => s + i.quantity, 0)} items
        </p>
      </div>
    </div>
  );
}