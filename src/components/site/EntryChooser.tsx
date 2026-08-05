"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { InstallButton } from "@/components/site/InstallButton";
import { EmployeeSlugForm } from "@/components/site/EmployeeSlugForm";
import { CHOOSER, EMPLOYEE } from "@/content/auth";
import { cn } from "@/lib/utils";

/**
 * The front door — one decision, then one path.
 *
 * Diego's read of the old page was exact: it was a long ivory scroll that
 * looked like a continuation of the practice screen, with the "who are you"
 * question buried across three stacked cards. Every choice below is
 * deliberate:
 *
 * - ONE DECISION FIRST. NN/g lower-literacy: satisficing users take the
 *   first plausible action; a page with three co-equal cards invites the
 *   wrong one. Two doors, labelled by identity ("Trabajo en el hotel" /
 *   "Dirijo al equipo"), nothing else competing.
 * - EMPLOYEE DOOR IS VISUALLY PRIMARY (solid ivory card on the dark field;
 *   HR is the outlined ghost). ~95% of arrivals are employees; the
 *   hierarchy encodes the base rate.
 * - HR GOES STRAIGHT TO /hr/login. An intermediate panel for the minority
 *   path is a step that pays no rent.
 * - INSTALL IS STEP 01 of the employee path, before entry. Browsers do not
 *   allow forcing an install, so "mandatory" is expressed structurally: it
 *   is the first numbered step, full-width, with the reason stated (works
 *   without signal on shift). "Ya la tengo" lets an installed user pass
 *   without lying to us.
 * - The chooser is client-state, not routes: tapping back never loses the
 *   page, and there is nothing to deep-link — the door is the door.
 */
export function EntryChooser() {
  const [path, setPath] = useState<"none" | "employee">("none");

  if (path === "employee") {
    return (
      <div>
        <button
          type="button"
          onClick={() => setPath("none")}
          className="caps inline-flex min-h-[44px] items-center gap-2 text-ivory-light/60 transition-colors hover:text-ivory-light"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {CHOOSER.back}
        </button>

        <h1 className="mt-4 font-serif text-[clamp(1.75rem,6vw,2.5rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ivory-light">
          {CHOOSER.employeeSteps.title.before}
          <em className="!text-ink-soft">{CHOOSER.employeeSteps.title.em}</em>
          {CHOOSER.employeeSteps.title.after}
        </h1>

        {/* ── 01 · Install — first, framed as the rule ─────────── */}
        <div className="mt-8 rounded-md bg-ivory p-5 text-espresso sm:p-7">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.6875rem] font-medium tracking-[0.2em] text-ink">
              01
            </span>
            <p className="caps text-espresso-muted">{CHOOSER.stepInstall.eyebrow}</p>
          </div>
          <h2 className="mt-2 font-serif text-t-h3 font-medium">
            {CHOOSER.stepInstall.title}
          </h2>
          <p className="mt-1.5 font-sans text-t-body text-espresso-soft">
            {CHOOSER.stepInstall.why}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <InstallButton variant="primary" size="lg" />
            <span className="font-sans text-t-caption text-espresso-muted">
              {CHOOSER.stepInstall.already}
            </span>
          </div>
        </div>

        {/* ── 02 · Enter ────────────────────────────────────────── */}
        <div className="mt-4 rounded-md bg-ivory p-5 text-espresso sm:p-7">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-[0.6875rem] font-medium tracking-[0.2em] text-ink">
              02
            </span>
            <p className="caps text-espresso-muted">{CHOOSER.stepEnter.eyebrow}</p>
          </div>
          <h2 className="mt-2 font-serif text-t-h3 font-medium">
            {CHOOSER.stepEnter.title}
          </h2>
          <p className="mt-1.5 font-sans text-t-body text-espresso-soft">
            {CHOOSER.stepEnter.linkFirst}
          </p>
          <div className="mt-5 border-t border-hair pt-5">
            <p className="font-sans text-t-body text-espresso-soft">
              {EMPLOYEE.fallbackHint}
            </p>
            <div className="mt-3">
              <EmployeeSlugForm />
            </div>
            <p className="mt-3 font-sans text-t-caption text-espresso-muted">
              {EMPLOYEE.hint}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── The two doors ─────────────────────────────────────────── */
  return (
    <div>
      <p className="caps text-ivory-light/50">{CHOOSER.eyebrow}</p>
      <h1 className="mt-3 font-serif text-[clamp(2rem,8vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-ivory-light">
        {CHOOSER.title.before}
        <em className="!text-ink-soft">{CHOOSER.title.em}</em>
        {CHOOSER.title.after}
      </h1>

      <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
        {/* Employee — the primary door: solid card on the dark field */}
        <button
          type="button"
          onClick={() => setPath("employee")}
          className="group flex min-h-[9rem] flex-col justify-between rounded-md bg-ivory p-5 text-left text-espresso transition-colors hover:bg-ivory-light sm:min-h-[11rem] sm:p-6"
        >
          <p className="caps text-espresso-muted">{CHOOSER.employee.eyebrow}</p>
          <div>
            <span className="font-serif text-t-h2 font-medium leading-tight">
              {CHOOSER.employee.title}
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-3">
              <span className="font-sans text-t-body text-espresso-soft">
                {CHOOSER.employee.sub}
              </span>
              <ArrowRight
                className="h-5 w-5 flex-shrink-0 text-ink transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </button>

        {/* HR — the outlined door, straight to its login */}
        <Link
          href="/hr/login"
          className={cn(
            "group flex min-h-[9rem] flex-col justify-between rounded-md border border-ivory-light/25 p-5 text-left transition-colors",
            "hover:border-ivory-light/60 sm:min-h-[11rem] sm:p-6",
          )}
        >
          <p className="caps text-ivory-light/50">{CHOOSER.hr.eyebrow}</p>
          <div>
            <span className="font-serif text-t-h2 font-medium leading-tight text-ivory-light">
              {CHOOSER.hr.title}
            </span>
            <span className="mt-1.5 flex items-center justify-between gap-3">
              <span className="font-sans text-t-body text-ivory-light/60">
                {CHOOSER.hr.sub}
              </span>
              <ArrowRight
                className="h-5 w-5 flex-shrink-0 text-ink-soft transition-transform group-hover:translate-x-1"
                aria-hidden
              />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
