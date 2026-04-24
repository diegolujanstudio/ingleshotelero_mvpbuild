"use client";

import { useEffect } from "react";

/**
 * Belt-and-suspenders guard: if NEXT_PUBLIC_DEMO_MODE is true but the
 * hostname is the production domain, throw before anything renders.
 * This prevents demo data from ever appearing on ingleshotelero.com
 * even if someone accidentally sets the env var on the main branch.
 */
export function DemoGuard() {
  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_DEMO_MODE === "true" &&
      typeof window !== "undefined" &&
      window.location.hostname === "ingleshotelero.com"
    ) {
      document.body.innerHTML =
        "<pre style='padding:2rem;font-family:monospace'>DEMO_MODE is enabled on production hostname. This is a configuration error. Contact the admin.</pre>";
      throw new Error(
        "FATAL: NEXT_PUBLIC_DEMO_MODE=true on production hostname ingleshotelero.com",
      );
    }
  }, []);

  return null;
}
