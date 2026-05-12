"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { JsonEditor } from "@/components/masteros/JsonEditor";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { IMPORT } from "@/content/masteros";

type Step = "input" | "review" | "result";

interface DryRunResult {
  validCount: number;
  invalidCount: number;
  willInsert: number;
  willUpdate: number;
  invalid: Array<{ index: number; error: string }>;
}

interface ApplyResult {
  inserted: number;
  updated: number;
  failed: number;
  invalid: Array<{ index: number; error: string }>;
}

export function ImportClient() {
  const [step, setStep] = useState<Step>("input");
  const [text, setText] = useState<string>("[]");
  const [parsed, setParsed] = useState<unknown>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState<DryRunResult | null>(null);
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [working, setWorking] = useState(false);

  async function runValidate() {
    setPageError(null);
    if (parseError) {
      setPageError(IMPORT.error.parseFailed);
      return;
    }
    if (!Array.isArray(parsed)) {
      setPageError(IMPORT.error.notArray);
      return;
    }
    setWorking(true);
    try {
      const res = await fetch("/api/masteros/modules/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: parsed, dryRun: true }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPageError(typeof json.error === "string" ? json.error : "Error");
        return;
      }
      setDryRun(json as DryRunResult);
      setStep("review");
    } finally {
      setWorking(false);
    }
  }

  async function commit() {
    setWorking(true);
    try {
      const res = await fetch("/api/masteros/modules/bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: parsed }),
      });
      const json = await res.json();
      if (!res.ok) {
        setPageError(typeof json.error === "string" ? json.error : "Error");
        return;
      }
      setResult(json as ApplyResult);
      setStep("result");
    } finally {
      setWorking(false);
    }
  }

  function reset() {
    setStep("input");
    setText("[]");
    setParsed([]);
    setDryRun(null);
    setResult(null);
    setPageError(null);
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={IMPORT.eyebrow}
        title={
          <>
            {IMPORT.headline.before}
            <em>{IMPORT.headline.em}</em>
            {IMPORT.headline.after}
          </>
        }
        sub={IMPORT.sub}
        actions={
          <ButtonLink href="/masteros/modules" variant="ghost">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Volver
          </ButtonLink>
        }
      />

      <ol className="mt-6 grid gap-2 md:grid-cols-3">
        <Crumb n={1} label={IMPORT.step1.title} active={step === "input"} done={step !== "input"} />
        <Crumb n={2} label={IMPORT.step2.title} active={step === "review"} done={step === "result"} />
        <Crumb n={3} label={IMPORT.step3.title} active={step === "result"} />
      </ol>

      {pageError && (
        <p className="mt-4 rounded-md border border-error/40 bg-white p-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-error">
          {pageError}
        </p>
      )}

      {step === "input" && (
        <div className="mt-6 space-y-3">
          <JsonEditor
            value={text}
            onChange={(v, p, e) => {
              setText(v);
              setParsed(p);
              setParseError(e);
            }}
            rows={20}
            placeholder={IMPORT.step1.placeholder}
            ariaLabel="Pegar JSON"
          />
          <div className="flex justify-end">
            <Button variant="primary" onClick={runValidate} disabled={working}>
              {IMPORT.step1.parse}
            </Button>
          </div>
        </div>
      )}

      {step === "review" && dryRun && (
        <div className="mt-6 space-y-5">
          <div className="grid gap-3 md:grid-cols-4">
            <Stat label={IMPORT.step2.valid} value={dryRun.validCount} tone="success" />
            <Stat label={IMPORT.step2.invalid} value={dryRun.invalidCount} tone={dryRun.invalidCount > 0 ? "error" : "neutral"} />
            <Stat label={IMPORT.step2.insert} value={dryRun.willInsert} tone="neutral" />
            <Stat label={IMPORT.step2.update} value={dryRun.willUpdate} tone="neutral" />
          </div>
          {dryRun.invalid.length > 0 && (
            <div className="rounded-md border border-hair bg-white p-4">
              <p className="caps mb-2">Errores</p>
              <ul className="space-y-1">
                {dryRun.invalid.slice(0, 50).map((e) => (
                  <li
                    key={e.index}
                    className="font-mono text-[0.6875rem] text-espresso-soft"
                  >
                    <span className="text-error">[{e.index}]</span> {e.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setStep("input")}>
              {IMPORT.step2.back}
            </Button>
            <Button
              variant="primary"
              onClick={commit}
              disabled={working || dryRun.validCount === 0}
            >
              {working ? IMPORT.step2.applying : IMPORT.step2.apply}
            </Button>
          </div>
        </div>
      )}

      {step === "result" && result && (
        <div className="mt-6 space-y-5">
          <p className="font-serif text-t-h3 font-medium text-espresso">
            {IMPORT.step3.success}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label={IMPORT.step3.inserted} value={result.inserted} tone="success" />
            <Stat label={IMPORT.step3.updated} value={result.updated} tone="neutral" />
            <Stat label={IMPORT.step3.failed} value={result.failed} tone={result.failed > 0 ? "error" : "neutral"} />
          </div>
          <div className="flex justify-end gap-2">
            <ButtonLink href="/masteros/modules" variant="ghost">
              Volver al catálogo
            </ButtonLink>
            <Button variant="primary" onClick={reset}>
              {IMPORT.step3.again}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

function Crumb({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active?: boolean;
  done?: boolean;
}) {
  const ringClass = active
    ? "border-ink bg-ink-tint text-ink-deep"
    : done
      ? "border-success/40 bg-white text-success"
      : "border-hair bg-white text-espresso-muted";
  return (
    <li className={`flex items-center gap-2.5 rounded-md border p-3 ${ringClass}`}>
      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
        0{n}
      </span>
      <span className="font-sans text-t-label">{label}</span>
    </li>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "neutral" | "success" | "error";
}) {
  const color =
    tone === "success"
      ? "text-success"
      : tone === "error"
        ? "text-error"
        : "text-espresso";
  return (
    <div className="rounded-md border border-hair bg-white p-4">
      <p className="caps mb-1.5">{label}</p>
      <p className={`font-serif text-[1.75rem] font-medium leading-none ${color}`}>
        {value}
      </p>
    </div>
  );
}
