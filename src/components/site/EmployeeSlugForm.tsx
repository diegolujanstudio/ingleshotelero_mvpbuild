"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EMPLOYEE_ENTRY } from "@/content/auth";

const SLUG_RE = /^[a-z0-9-]+$/;

/**
 * Hotel-code field on the sign-in home. Submits to `/e/{slug}`.
 *
 * Validates client-side:
 *   - non-empty
 *   - only lowercase a-z, digits, and hyphens
 *
 * Routing is client-side via `next/navigation` so the input keeps focus
 * if validation fails. Trailing/leading whitespace is trimmed; the value
 * is lowercased before validation so a typo like `Gran-Hotel-Cancun`
 * still reaches the right slug.
 */
export function EmployeeSlugForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = slug.trim().toLowerCase();
    if (!cleaned || !SLUG_RE.test(cleaned)) {
      setError(EMPLOYEE_ENTRY.invalid);
      return;
    }
    setError(null);
    router.push(`/e/${cleaned}`);
  };

  return (
    <form onSubmit={submit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label={EMPLOYEE_ENTRY.inputLabel}
          placeholder={EMPLOYEE_ENTRY.inputPlaceholder}
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            if (error) setError(null);
          }}
          error={error ?? undefined}
          autoComplete="off"
          spellCheck={false}
          inputMode="url"
        />
      </div>
      <Button type="submit" variant="accent" size="md" className="sm:mb-0">
        {EMPLOYEE_ENTRY.submit}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Button>
    </form>
  );
}
