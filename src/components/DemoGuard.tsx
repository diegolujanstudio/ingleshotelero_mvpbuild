"use client";

import { useEffect, useState } from "react";

/**
 * Belt-and-suspenders demo gating.
 *
 * Two roles, both client-only because hostname is a window concept:
 *
 *   1. <DemoGuard /> — when rendered as a self-closing component (no
 *      children), it acts as a runtime tripwire: if NEXT_PUBLIC_DEMO_MODE
 *      is "true" but the hostname is the production domain, it overwrites
 *      the document body with a configuration-error notice and throws.
 *      This protects against the env var leaking into a production build.
 *
 *   2. <DemoGuard>{...}</DemoGuard> — when given children, it acts as a
 *      gate: children render ONLY when BOTH conditions hold:
 *        - process.env.NEXT_PUBLIC_DEMO_MODE === "true"
 *        - hostname is one of the demo-permitted hosts:
 *            · demo.ingleshotelero.com  (the canonical demo subdomain)
 *            · localhost                (local dev)
 *            · 127.0.0.1                (local dev alias)
 *            · *.netlify.app            (Netlify preview deploys)
 *
 *      Anything else — production domain, custom domain, an attacker's
 *      forwarded host — gets nothing.
 *
 * The gating intentionally returns null on first render to avoid
 * hydration mismatches; the children appear on the client tick after
 * mount when the predicate confirms.
 */

const isDemoHost = (host: string): boolean => {
  if (!host) return false;
  const h = host.toLowerCase();
  return (
    h === "demo.ingleshotelero.com" ||
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".netlify.app")
  );
};

export function DemoGuard({ children }: { children?: React.ReactNode }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const isDemoEnv = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
    if (typeof window === "undefined") return;
    const host = window.location.hostname;

    // Tripwire: demo env on a production hostname is a config error.
    if (isDemoEnv && host === "ingleshotelero.com") {
      document.body.innerHTML =
        "<pre style='padding:2rem;font-family:monospace'>DEMO_MODE is enabled on production hostname. This is a configuration error. Contact the admin.</pre>";
      throw new Error(
        "FATAL: NEXT_PUBLIC_DEMO_MODE=true on production hostname ingleshotelero.com",
      );
    }

    // Gating: render children only if env AND hostname both pass.
    setAllowed(isDemoEnv && isDemoHost(host));
  }, []);

  // Tripwire-only invocation (no children) — the effect has done its job.
  if (children === undefined) return null;

  if (!allowed) return null;
  return <>{children}</>;
}
