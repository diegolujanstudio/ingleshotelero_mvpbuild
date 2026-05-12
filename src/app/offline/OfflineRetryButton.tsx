"use client";

import { Button } from "@/components/ui/Button";
import { RefreshCcw } from "lucide-react";

/**
 * Tiny client island — the rest of /offline stays a Server Component
 * (and stays trivially precacheable by the SW).
 */
export function OfflineRetryButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="primary"
      size="lg"
      onClick={() => {
        try {
          window.location.reload();
        } catch {
          // unreachable in any modern browser
        }
      }}
    >
      <RefreshCcw className="h-4 w-4" aria-hidden />
      {label}
    </Button>
  );
}
