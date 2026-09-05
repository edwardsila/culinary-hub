import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { storeConfig } from "@/lib/store";
import OrderStatusManager from "@/components/admin/OrderStatusManager";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order) notFound();

  const waLink = `https://wa.me/${order.customerPhone.replace(/^0/, "254").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hello ${order.customerName}! Regarding your order ${order.orderNumber} with ${storeConfig.name} (status: ${order.status})...`
  )}`;

  return (
    <div className="space-y-6">
      <div>
        <nav className="flex text-sm text-gray-500">
          <Link href="/admin/orders" className="hover:text-brand-600">
            Orders
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">
            {order.orderNumber}
          </span>
        </nav>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderNumber}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
            >
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Contact Customer
            </a>
          </div>
        </div>
      </div>

      <OrderStatusManager order={order} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-bold text-gray-900">Items</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Qty
                  </th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatPrice(item.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Order Total
                  </td>
                  <td className="px-4 py-3 text-right text-base font-bold text-brand-600">
                    {formatPrice(order.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Customer Details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.customerName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone
                </dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.customerPhone}
                </dd>
              </div>
              {order.customerEmail && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {order.customerEmail}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Delivery Details
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Method
                </dt>
                <dd className="mt-0.5 font-medium capitalize text-gray-900">
                  {order.deliveryMethod === "pickup" ? "Store Pickup" : "Courier"}
                </dd>
              </div>
              {order.deliveryMethod === "courier" && (
                <>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Address
                    </dt>
                    <dd className="mt-0.5 font-medium text-gray-900">
                      {order.deliveryAddress}
                      {order.city ? `, ${order.city}` : ""}
                    </dd>
                  </div>
                </>
              )}
              {order.notes && (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Notes
                  </dt>
                  <dd className="mt-0.5 text-gray-700">{order.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Placed On
                </dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString("en-KE", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}