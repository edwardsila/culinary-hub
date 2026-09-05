import Link from "next/link";
import { storeConfig } from "@/lib/store";

export const metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Culinary Hub for orders, questions, and support.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="bg-gradient-to-br from-brand-50 via-brand-100 to-amber-100 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Contact Us
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            We&apos;re here to help. Reach out anytime — our team responds
            quickly via WhatsApp.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {[
            {
              title: "WhatsApp / Phone",
              value: storeConfig.phone,
              desc: "Fastest way to reach us — messages are answered within minutes during business hours.",
              href: `https://wa.me/${storeConfig.whatsapp}`,
              icon: (
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              ),
            },
            {
              title: "Email",
              value: storeConfig.email,
              desc: "For detailed inquiries, partnerships, or bulk/wholesale orders.",
              href: `mailto:${storeConfig.email}`,
              icon: (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              title: "Visit Us",
              value: storeConfig.location,
              desc: "Prefer to see products in person? Come by our location for pickup and demos.",
              href: "#",
              icon: (
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              className="group rounded-xl border border-gray-200 p-6 transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                {card.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="mt-1 font-medium text-brand-600">{card.value}</p>
              <p className="mt-2 text-sm text-gray-500">{card.desc}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 rounded-2xl border border-gray-200 p-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Hours</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
                { days: "Saturday", hours: "9:00 AM - 4:00 PM" },
                { days: "Sunday & Holidays", hours: "WhatsApp orders only" },
              ].map((row) => (
                <div key={row.days} className="flex justify-between border-b border-gray-100 pb-2">
                  <dt className="font-medium text-gray-700">{row.days}</dt>
                  <dd className="text-gray-600">{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quick Links</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-brand-600 hover:text-brand-700">
                  Browse Products →
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-brand-600 hover:text-brand-700">
                  Track Your Order →
                </Link>
              </li>
              <li>
                <Link href={`https://wa.me/${storeConfig.whatsapp}`} target="_blank" className="text-brand-600 hover:text-brand-700">
                  Order via WhatsApp →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}