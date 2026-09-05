"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { formatPrice } from "@/lib/utils";
import { storeConfig } from "@/lib/store";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useStore();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
            <svg className="h-12 w-12 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Your cart is empty
          </h1>
          <p className="mt-2 text-gray-500">
            Looks like you haven&apos;t added anything yet. Explore our premium
            kitchen collection.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-lg bg-brand-600 px-8 py-3 text-base font-semibold text-white hover:bg-brand-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee =
    cartTotal >= storeConfig.freeDeliveryThreshold ? 0 : storeConfig.deliveryFee;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Shopping Cart{" "}
          <span className="text-lg font-normal text-gray-500">
            ({cartCount} items)
          </span>
        </h1>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100"
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-brand-50">
                      <svg className="h-8 w-8 text-brand-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <Link
                      href={`/product/${item.slug}`}
                      className="text-sm font-semibold text-gray-900 hover:text-brand-600"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500"
                      aria-label="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <p className="mt-1 text-sm font-medium text-brand-600">
                    {formatPrice(item.price)}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="px-3 py-1.5 text-gray-500 hover:text-brand-600"
                        aria-label="Decrease"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="px-3 py-1.5 text-gray-500 hover:text-brand-600"
                        aria-label="Increase"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

              <dl className="mt-5 space-y-3 text-sm">
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
                {cartTotal < storeConfig.freeDeliveryThreshold && (
                  <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                    Add{" "}
                    {formatPrice(
                      storeConfig.freeDeliveryThreshold - cartTotal
                    )}{" "}
                    more for free delivery!
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-200 pt-3 text-base">
                  <dt className="font-bold text-gray-900">Total</dt>
                  <dd className="font-bold text-brand-600">
                    {formatPrice(cartTotal + deliveryFee)}
                  </dd>
                </div>
              </dl>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-lg bg-brand-600 px-6 py-3.5 text-center text-base font-semibold text-white transition hover:bg-brand-700"
              >
                Proceed to Checkout
              </Link>
              <Link
                href="/shop"
                className="mt-3 block w-full rounded-lg border-2 border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-brand-600 hover:text-brand-600"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}