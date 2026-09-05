import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

interface OrdersPageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const { status } = await searchParams;
  const where = status && status !== "all" ? { status } : {};

  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const statusTabs = [
    { key: "all", label: "All", count: await prisma.order.count() },
    { key: "pending", label: "Pending", count: await prisma.order.count({ where: { status: "pending" } }) },
    { key: "confirmed", label: "Confirmed", count: await prisma.order.count({ where: { status: "confirmed" } }) },
    { key: "processing", label: "Processing", count: await prisma.order.count({ where: { status: "processing" } }) },
    { key: "shipped", label: "Shipped", count: await prisma.order.count({ where: { status: "shipped" } }) },
    { key: "delivered", label: "Delivered", count: await prisma.order.count({ where: { status: "delivered" } }) },
    { key: "cancelled", label: "Cancelled", count: await prisma.order.count({ where: { status: "cancelled" } }) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-gray-500">
          Manage customer orders and delivery status.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <Link
            key={tab.key}
            href={`/admin/orders${tab.key !== "all" ? `?status=${tab.key}` : ""}`}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              (status || "all") === tab.key
                ? "bg-brand-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label} ({tab.count})
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Delivery
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  {status && status !== "all"
                    ? `No ${status} orders.`
                    : "No orders yet. Share your store link with customers!"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-brand-600 hover:text-brand-700"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customerPhone}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 capitalize">
                      {order.deliveryMethod === "pickup" ? "Store pickup" : "Courier"}
                    </p>
                    {order.deliveryMethod === "courier" && (
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {order.deliveryAddress}
                        {order.city ? `, ${order.city}` : ""}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm font-semibold text-brand-600 hover:text-brand-700"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}