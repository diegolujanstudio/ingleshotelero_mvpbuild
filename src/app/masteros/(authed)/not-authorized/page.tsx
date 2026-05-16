import Link from "next/link";
import { NOT_AUTHORIZED } from "@/content/masteros";

/**
 * Reserved fallback. Middleware + requireSuperAdmin() should always intercept
 * non-super_admin traffic to /masteros/* before this renders. Kept as a
 * harmless terminal page in case a future route forgets the gate.
 */
export const metadata = {
  title: NOT_AUTHORIZED.title,
  robots: { index: false, follow: false },
};

export default function NotAuthorizedPage() {
  return (
    <section className="mx-auto max-w-prose px-6 py-16">
      <p className="caps mb-2">403</p>
      <h1 className="font-serif text-t-h2 font-medium text-espresso">
        {NOT_AUTHORIZED.title}
      </h1>
      <p className="mt-3 font-sans text-t-body text-espresso-soft">
        {NOT_AUTHORIZED.body}
      </p>
      <p className="mt-6">
        <Link href="/" className="text-ink underline-offset-4 hover:underline">
          {NOT_AUTHORIZED.link}
        </Link>
      </p>
    </section>
  );
}
