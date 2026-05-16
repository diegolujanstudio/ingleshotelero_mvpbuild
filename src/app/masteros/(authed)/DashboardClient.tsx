"use client";

import { useState, useTransition } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RefreshCw } from "lucide-react";
import { SectionHeader } from "@/components/masteros/SectionHeader";
import { MetricCard } from "@/components/masteros/MetricCard";
import { ChartCard } from "@/components/masteros/ChartCard";
import { Button } from "@/components/ui/Button";
import { DASHBOARD } from "@/content/masteros";
import type { MetricsPayload } from "@/lib/masteros/metrics";

const TOKENS = {
  ink: "#2E4761",
  inkDeep: "#1C2E42",
  inkSoft: "#C3CDD8",
  espresso: "#2B1D14",
  espressoMuted: "#7A6352",
  hair: "#D9CEB9",
  ivorySoft: "#EFE7D6",
  warn: "#B38540",
  success: "#3E6D4D",
};

const AXIS_PROPS = {
  stroke: TOKENS.espressoMuted,
  tick: { fill: TOKENS.espressoMuted, fontSize: 10, fontFamily: "var(--font-mono)" },
  tickLine: false,
  axisLine: { stroke: TOKENS.hair },
};

const TOOLTIP_STYLE: React.CSSProperties = {
  backgroundColor: "white",
  border: `1px solid ${TOKENS.hair}`,
  borderRadius: 6,
  fontFamily: "var(--font-sans)",
  fontSize: 12,
  color: TOKENS.espresso,
};

interface Props {
  initial: MetricsPayload;
  initialDemo?: boolean;
}

export function DashboardClient({ initial, initialDemo }: Props) {
  const [data, setData] = useState<MetricsPayload>(initial);
  const [demo, setDemo] = useState<boolean>(Boolean(initialDemo));
  const [pending, startTransition] = useTransition();

  function refresh() {
    startTransition(async () => {
      try {
        const res = await fetch("/api/masteros/metrics", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as MetricsPayload & { demo?: boolean };
        setData(json);
        setDemo(Boolean(json.demo));
      } catch {
        // ignore — leave existing data on screen
      }
    });
  }

  return (
    <section className="mx-auto max-w-shell px-6 py-8 md:px-10 md:py-10">
      <SectionHeader
        eyebrow={DASHBOARD.eyebrow}
        title={
          <>
            {DASHBOARD.headline.before}
            <em>{DASHBOARD.headline.em}</em>
            {DASHBOARD.headline.after}
          </>
        }
        sub={DASHBOARD.sub}
        actions={
          <>
            {demo && (
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-warn">
                Modo demo
              </span>
            )}
            <Button variant="ghost" onClick={refresh} disabled={pending}>
              <RefreshCw className={`h-3.5 w-3.5 ${pending ? "animate-spin" : ""}`} aria-hidden />
              {pending ? DASHBOARD.refreshing : DASHBOARD.refresh}
            </Button>
          </>
        }
      />

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <MetricCard
          eyebrow={DASHBOARD.cards.activeEmployees.eyebrow}
          value={data.totals.activeEmployees7d}
          caption={DASHBOARD.cards.activeEmployees.caption}
        />
        <MetricCard
          eyebrow={DASHBOARD.cards.examsCompleted.eyebrow}
          value={data.totals.examsCompleted30d}
          caption={DASHBOARD.cards.examsCompleted.caption}
        />
        <MetricCard
          eyebrow={DASHBOARD.cards.scoringQueue.eyebrow}
          value={data.totals.scoringQueue}
          caption={DASHBOARD.cards.scoringQueue.caption}
        />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <ChartCard
          eyebrow={DASHBOARD.charts.daily.eyebrow}
          title={DASHBOARD.charts.daily.title}
          caption={DASHBOARD.charts.daily.caption}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={data.charts.dailyActive}
              margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
              <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={shortDay} />
              <YAxis allowDecimals={false} {...AXIS_PROPS} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={TOKENS.ink}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3, fill: TOKENS.inkDeep }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          eyebrow={DASHBOARD.charts.levels.eyebrow}
          title={DASHBOARD.charts.levels.title}
          caption={DASHBOARD.charts.levels.caption}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data.charts.levelDistribution}
              margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
              <XAxis dataKey="level" {...AXIS_PROPS} />
              <YAxis allowDecimals={false} {...AXIS_PROPS} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                {data.charts.levelDistribution.map((d, i) => (
                  <Cell
                    key={d.level}
                    fill={
                      i === 3
                        ? TOKENS.ink
                        : i === 2
                          ? TOKENS.inkDeep
                          : i === 1
                            ? TOKENS.inkSoft
                            : TOKENS.ivorySoft
                    }
                    stroke={TOKENS.ink}
                    strokeWidth={i === 0 ? 1 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          eyebrow={DASHBOARD.charts.drills.eyebrow}
          title={DASHBOARD.charts.drills.title}
          caption={DASHBOARD.charts.drills.caption}
        >
          <ResponsiveContainer width="100%" height={220}>
            <LineChart
              data={data.charts.drills}
              margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
              <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={shortDay} />
              <YAxis allowDecimals={false} {...AXIS_PROPS} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Legend
                wrapperStyle={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: TOKENS.espressoMuted,
                  paddingTop: 4,
                }}
              />
              <Line
                type="monotone"
                dataKey="invited"
                stroke={TOKENS.espressoMuted}
                strokeWidth={1.25}
                strokeDasharray="3 3"
                dot={false}
                name="Invitados"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke={TOKENS.ink}
                strokeWidth={1.5}
                dot={false}
                name="Completados"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          eyebrow={DASHBOARD.charts.cost.eyebrow}
          title={DASHBOARD.charts.cost.title}
          caption={DASHBOARD.charts.cost.caption}
          footnote={DASHBOARD.charts.cost.assumption}
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={data.charts.cost}
              margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
              <XAxis dataKey="date" {...AXIS_PROPS} tickFormatter={shortDay} />
              <YAxis {...AXIS_PROPS} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(v: number) => `$${v.toFixed(2)}`}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: TOKENS.espressoMuted,
                  paddingTop: 4,
                }}
              />
              <Bar dataKey="whisper" stackId="cost" fill={TOKENS.inkSoft} name="Whisper" />
              <Bar dataKey="claude" stackId="cost" fill={TOKENS.ink} name="Claude" />
              <Bar dataKey="elevenlabs" stackId="cost" fill={TOKENS.inkDeep} name="ElevenLabs" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <p className="mt-6 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-espresso-muted">
        Generado · {new Date(data.generated_at).toLocaleString("es-MX")}
      </p>
    </section>
  );
}

function shortDay(iso: string): string {
  // Expect YYYY-MM-DD; show DD/MM
  if (typeof iso !== "string" || iso.length < 10) return String(iso);
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}
