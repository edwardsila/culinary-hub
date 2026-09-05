"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Confirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-gray-600">
          Thank you for shopping with Culinary Hub. Your order has been
          received. We&apos;ve opened WhatsApp where you can confirm the details
          with our team.
        </p>

        {orderNumber && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">Your Order Number</p>
            <p className="mt-1 text-2xl font-bold text-brand-600">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Continue Shopping
          </Link>
          <Link
            href="/track"
            className="rounded-lg border-2 border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-brand-600 hover:text-brand-600"
          >
            Track Your Order
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Pro tip:</strong> Save your order
            number. You can use it anytime to track the status of your order.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center">Loading...</div>}>
      <Confirmation />
    </Suspense>
  );
}