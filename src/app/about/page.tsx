import Link from "next/link";

export const metadata = {
  title: "About Us",
  description:
    "Learn about Culinary Hub — Kenya's trusted source for premium kitchen utensils.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-brand-50 via-brand-100 to-amber-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About Culinary Hub
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            We&apos;re on a mission to equip every Kenyan kitchen with quality,
            durable, and beautiful cookware — at prices that make sense.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Culinary Hub was born from a simple observation: Kenyan kitchens
              are the heart of the home, yet finding quality cookware at fair
              prices was always a struggle. From imports to local markets, we
              saw a gap between what was available and what Kenyan families
              truly deserved.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We started small — curating non-stick pots, professional knives,
              and serving essentials that combine durability with style. Today,
              we&apos;re proud to serve customers across all 47 counties with
              fast, reliable delivery and personal WhatsApp-based ordering that
              puts you first.
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">
              When you shop with us, you&apos;re not just buying cookware —
              you&apos;re joining a community that celebrates the joy of
              cooking, sharing meals, and creating memories around the table.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              What Makes Us Different
            </h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  title: "Quality you can trust",
                  desc: "Every product is handpicked and tested for durability, safety, and performance.",
                },
                {
                  title: "Fair Kenyan pricing",
                  desc: "No inflated markups. Competitive prices with regular discounts on bestsellers.",
                },
                {
                  title: "Personal ordering",
                  desc: "Order directly via WhatsApp and talk to a real person, not a chatbot.",
                },
                {
                  title: "Fast nationwide delivery",
                  desc: "Nairobi same-day, upcountry within 24-48 hours. Free delivery on qualifying orders.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-xl border border-gray-200 p-4"
                >
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-brand-600 to-amber-500 px-8 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to upgrade your kitchen?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-brand-50">
            Browse our catalog and join thousands of happy Kenyan home cooks.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-brand-600 shadow-lg transition hover:bg-brand-50"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}