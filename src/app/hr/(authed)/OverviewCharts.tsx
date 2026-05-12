"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/masteros/ChartCard";
import { OVERVIEW } from "@/content/hr";
import { ROLES } from "@/content/roles";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";

const TOKENS = {
  ink: "#2E4761",
  inkDeep: "#1C2E42",
  inkSoft: "#C3CDD8",
  espresso: "#2B1D14",
  espressoMuted: "#7A6352",
  hair: "#D9CEB9",
  ivorySoft: "#EFE7D6",
};

const AXIS = {
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
  levelDistribution: Array<{ level: CEFRLevel; count: number }>;
  byRole: Array<{ role: RoleModule; count: number }>;
  weeklyExams: Array<{ week: string; count: number }>;
}

export function OverviewCharts({ levelDistribution, byRole, weeklyExams }: Props) {
  const roleData = byRole.map((r) => ({
    role: ROLES[r.role].label_es,
    count: r.count,
  }));

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <ChartCard
        eyebrow={OVERVIEW.charts.levelDistribution.eyebrow}
        title={OVERVIEW.charts.levelDistribution.title}
        caption={OVERVIEW.charts.levelDistribution.caption}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={levelDistribution}
            margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="level" {...AXIS} />
            <YAxis allowDecimals={false} {...AXIS} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" radius={[3, 3, 0, 0]}>
              {levelDistribution.map((d, i) => (
                <Cell
                  key={d.level}
                  fill={
                    i === 3 ? TOKENS.ink : i === 2 ? TOKENS.inkDeep : i === 1 ? TOKENS.inkSoft : TOKENS.ivorySoft
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
        eyebrow={OVERVIEW.charts.activityByRole.eyebrow}
        title={OVERVIEW.charts.activityByRole.title}
        caption={OVERVIEW.charts.activityByRole.caption}
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={roleData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="role" {...AXIS} />
            <YAxis allowDecimals={false} {...AXIS} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" fill={TOKENS.ink} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        eyebrow={OVERVIEW.charts.weeklyExams.eyebrow}
        title={OVERVIEW.charts.weeklyExams.title}
        caption={OVERVIEW.charts.weeklyExams.caption}
      >
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={weeklyExams}
            margin={{ top: 8, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid stroke={TOKENS.hair} strokeDasharray="2 2" vertical={false} />
            <XAxis dataKey="week" {...AXIS} />
            <YAxis allowDecimals={false} {...AXIS} />
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
    </div>
  );
}
