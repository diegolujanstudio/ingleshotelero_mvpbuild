import "server-only";

/**
 * HR executive PDF report generator.
 *
 * Five pages per phase-4 spec:
 *   1. Cover (logo monogram, hotel name, date range)
 *   2. Executive summary (level distribution + average + key finding)
 *   3. Level distribution chart (bar chart by role)
 *   4. Employees table (paginated across pages)
 *   5. Methodology (last)
 *
 * Brand-locked: ink (#2E4761) for headings, espresso (#2B1D14) for body,
 * hair (#D9CEB9) for rules. No emoji. Hairlines instead of borders.
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { CEFRLevel, RoleModule } from "@/lib/supabase/types";
import type { HREmployeeView } from "./demo-bridge";

const TOKENS = {
  ink: [46, 71, 97] as [number, number, number],
  espresso: [43, 29, 20] as [number, number, number],
  espressoMuted: [122, 99, 82] as [number, number, number],
  hair: [217, 206, 185] as [number, number, number],
  ivory: [245, 240, 230] as [number, number, number],
  ivorySoft: [239, 231, 214] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const ROLE_LABEL: Record<RoleModule, string> = {
  bellboy: "Botones",
  frontdesk: "Recepción",
  restaurant: "Restaurante / Bar",
};

export interface BuildReportOptions {
  propertyName: string;
  generatedAt: Date;
  filters?: {
    cohort?: string;
    role?: RoleModule | "all";
    level?: CEFRLevel | "all";
    from?: string;
    to?: string;
  };
  employees: HREmployeeView[];
}

export function buildReportPdf(opts: BuildReportOptions): Uint8Array {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;

  const employees = opts.employees;
  const dateLabel = opts.generatedAt.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Page 1 — Cover ─────────────────────────────────────────────
  drawHairline(doc, margin, 96, pageW - margin, 96);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.setFontSize(8);
  doc.text("REPORTE EJECUTIVO · INGLÉS HOTELERO", margin, 84);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TOKENS.espresso);
  doc.setFontSize(28);
  doc.text("Evaluación de Inglés Hotelero", margin, 180);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(...TOKENS.ink);
  doc.text(opts.propertyName, margin, 210);

  doc.setFontSize(9);
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.text(`Generado · ${dateLabel}`, margin, 232);
  if (opts.filters?.from || opts.filters?.to) {
    doc.text(
      `Periodo · ${opts.filters.from ?? "inicio"} a ${opts.filters.to ?? "hoy"}`,
      margin,
      246,
    );
  }

  // Cover footer
  drawHairline(doc, margin, pageH - 80, pageW - margin, pageH - 80);
  doc.setFontSize(8);
  doc.text("Confidencial · Para uso interno del hotel.", margin, pageH - 60);

  // ── Page 2 — Executive summary ──────────────────────────────────
  doc.addPage();
  pageHeader(doc, "Resumen ejecutivo", 1, opts.propertyName, margin);

  const total = employees.length;
  const counts: Record<CEFRLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
  for (const e of employees) if (e.current_level) counts[e.current_level]++;
  const avgScore =
    total > 0
      ? Math.round(employees.reduce((s, e) => s + e.combined_score, 0) / total)
      : 0;
  const active7d = employees.filter((e) => e.last_active_days_ago <= 7).length;
  const participation = total > 0 ? Math.round((active7d / total) * 100) : 0;

  let y = 140;
  drawStatRow(doc, margin, pageW - margin, y, [
    ["Total empleados", String(total)],
    ["Puntaje promedio", `${avgScore}/100`],
    ["Activos esta semana", String(active7d)],
    ["Participación", `${participation}%`],
  ]);

  y += 80;
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.setFontSize(8);
  doc.text("HALLAZGO PRINCIPAL", margin, y);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...TOKENS.espresso);
  doc.setFontSize(13);
  const finding = keyFinding(total, counts);
  const wrappedFinding = doc.splitTextToSize(finding, pageW - margin * 2);
  doc.text(wrappedFinding, margin, y);
  y += wrappedFinding.length * 16 + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TOKENS.espressoMuted);
  const recommendation = keyRecommendation(total, counts);
  const wrappedRec = doc.splitTextToSize(recommendation, pageW - margin * 2);
  doc.text(wrappedRec, margin, y);

  // ── Page 3 — Level distribution chart ────────────────────────────
  doc.addPage();
  pageHeader(doc, "Distribución de niveles", 2, opts.propertyName, margin);

  drawLevelChart(doc, margin, 160, pageW - margin * 2, 220, counts, total);

  // Per-role breakdown
  const roleY = 420;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.setFontSize(8);
  doc.text("POR PUESTO", margin, roleY);
  drawHairline(doc, margin, roleY + 6, pageW - margin, roleY + 6);

  const roles: RoleModule[] = ["bellboy", "frontdesk", "restaurant"];
  const colW = (pageW - margin * 2) / 3;
  roles.forEach((r, i) => {
    const dept = employees.filter((e) => e.hotel_role === r);
    const deptAvg =
      dept.length > 0
        ? Math.round(dept.reduce((s, e) => s + e.combined_score, 0) / dept.length)
        : 0;
    const x = margin + i * colW;
    doc.setTextColor(...TOKENS.espressoMuted);
    doc.setFontSize(8);
    doc.text(ROLE_LABEL[r].toUpperCase(), x, roleY + 28);
    doc.setFontSize(22);
    doc.setTextColor(...TOKENS.espresso);
    doc.setFont("helvetica", "bold");
    doc.text(String(dept.length), x, roleY + 56);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...TOKENS.espressoMuted);
    doc.text(`empleados · promedio ${deptAvg}/100`, x, roleY + 70);
  });

  // ── Pages 4..N — Employees table ─────────────────────────────────
  doc.addPage();
  pageHeader(doc, "Detalle por empleado", 3, opts.propertyName, margin);

  autoTable(doc, {
    startY: 130,
    head: [
      ["Nombre", "Puesto", "Nivel", "Puntaje", "Escucha", "Habla", "Últ. activ."],
    ],
    body: employees.map((e) => [
      e.name,
      ROLE_LABEL[e.hotel_role],
      e.current_level ?? "—",
      `${e.combined_score}/100`,
      String(e.listening_score),
      String(e.speaking_score),
      e.last_active_days_ago === 0
        ? "hoy"
        : e.last_active_days_ago > 99
          ? "—"
          : `${e.last_active_days_ago}d`,
    ]),
    theme: "plain",
    headStyles: {
      fillColor: TOKENS.ivorySoft,
      textColor: TOKENS.espressoMuted,
      fontStyle: "bold",
      fontSize: 8,
      lineColor: TOKENS.hair,
      lineWidth: 0.5,
      cellPadding: 6,
    },
    bodyStyles: {
      textColor: TOKENS.espresso,
      fontSize: 9,
      lineColor: TOKENS.hair,
      lineWidth: 0.5,
      cellPadding: 6,
    },
    alternateRowStyles: { fillColor: TOKENS.white },
    margin: { left: margin, right: margin },
    didDrawPage: () => {
      // page number footer
      doc.setTextColor(...TOKENS.espressoMuted);
      doc.setFontSize(8);
      doc.text(
        `Inglés Hotelero · ${opts.propertyName}`,
        margin,
        pageH - 30,
      );
    },
  });

  // ── Last page — Methodology ──────────────────────────────────────
  doc.addPage();
  pageHeader(doc, "Metodología", 99, opts.propertyName, margin);

  let my = 140;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...TOKENS.espresso);
  const para1 =
    "La evaluación se compone de un examen de comprensión auditiva (10 ítems con audio sintetizado) y un examen de expresión oral (6 escenarios role-play, grabados desde el dispositivo del empleado).";
  const para2 =
    "El puntaje combinado se calcula como 60% expresión oral + 40% comprensión auditiva. La calibración CEFR se adapta al contexto hotelero — A1 Supervivencia · A2 Funcional · B1 Profesional · B2 Avanzado.";
  const para3 =
    "Las grabaciones de voz se transcriben con OpenAI Whisper y se evalúan por Anthropic Claude bajo una rúbrica de cuatro dimensiones: intención, vocabulario, fluidez y tono. Resultados disponibles 30 segundos después de la grabación.";
  const para4 =
    "Privacidad: las grabaciones se conservan 6 meses (LFPDPPP). Los empleados aceptan el aviso de privacidad antes de iniciar el examen.";

  for (const p of [para1, para2, para3, para4]) {
    const wrapped = doc.splitTextToSize(p, pageW - margin * 2);
    doc.text(wrapped, margin, my);
    my += wrapped.length * 14 + 12;
  }

  drawHairline(doc, margin, pageH - 60, pageW - margin, pageH - 60);
  doc.setFontSize(8);
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.text("hola@ingleshotelero.com · ingleshotelero.com", margin, pageH - 40);

  return new Uint8Array(doc.output("arraybuffer"));
}

function pageHeader(
  doc: jsPDF,
  title: string,
  index: number,
  property: string,
  margin: number,
) {
  doc.setTextColor(...TOKENS.espressoMuted);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  const idxLabel = index === 99 ? "ANEXO" : `SECCIÓN ${String(index).padStart(2, "0")}`;
  doc.text(`${idxLabel} · ${property.toUpperCase()}`, margin, 64);
  drawHairline(doc, margin, 76, doc.internal.pageSize.getWidth() - margin, 76);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...TOKENS.espresso);
  doc.text(title, margin, 110);
}

function drawHairline(
  doc: jsPDF,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  doc.setDrawColor(...TOKENS.hair);
  doc.setLineWidth(0.5);
  doc.line(x1, y1, x2, y2);
}

function drawStatRow(
  doc: jsPDF,
  xL: number,
  xR: number,
  y: number,
  stats: Array<[string, string]>,
) {
  const colW = (xR - xL) / stats.length;
  doc.setDrawColor(...TOKENS.hair);
  doc.setLineWidth(0.5);
  doc.rect(xL, y, xR - xL, 64);
  stats.forEach(([label, value], i) => {
    const cx = xL + i * colW;
    if (i > 0) doc.line(cx, y, cx, y + 64);
    doc.setTextColor(...TOKENS.espressoMuted);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(label.toUpperCase(), cx + 12, y + 18);
    doc.setTextColor(...TOKENS.espresso);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(value, cx + 12, y + 46);
  });
}

function drawLevelChart(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  counts: Record<CEFRLevel, number>,
  total: number,
) {
  const levels: CEFRLevel[] = ["A1", "A2", "B1", "B2"];
  const max = Math.max(1, ...levels.map((l) => counts[l]));
  const rowH = h / 4;
  const barAreaX = x + 80;
  const barAreaW = w - 160;

  levels.forEach((level, i) => {
    const ry = y + i * rowH + 8;
    const count = counts[level];
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    const barW = (count / max) * barAreaW;

    // Level label
    doc.setTextColor(...TOKENS.espresso);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(level, x, ry + rowH / 2 + 2);

    // Bar background
    doc.setFillColor(...TOKENS.ivorySoft);
    doc.rect(barAreaX, ry, barAreaW, rowH - 16, "F");

    // Bar fill
    doc.setFillColor(...TOKENS.ink);
    doc.rect(barAreaX, ry, Math.max(barW, 2), rowH - 16, "F");

    // Count
    doc.setTextColor(...TOKENS.espresso);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${count}`, barAreaX + barAreaW + 12, ry + rowH / 2);
    doc.setTextColor(...TOKENS.espressoMuted);
    doc.text(`${pct}%`, barAreaX + barAreaW + 40, ry + rowH / 2);
  });
}

function keyFinding(
  total: number,
  counts: Record<CEFRLevel, number>,
): string {
  if (total === 0) return "Aún no hay evaluaciones registradas.";
  const a1a2 = counts.A1 + counts.A2;
  const pctLow = Math.round((a1a2 / total) * 100);
  if (pctLow >= 50) {
    return `El ${pctLow}% del equipo está en A1 o A2 — limitado para huéspedes internacionales.`;
  }
  const b1b2 = counts.B1 + counts.B2;
  const pctHigh = Math.round((b1b2 / total) * 100);
  return `El ${pctHigh}% del equipo está en B1 o B2 — base sólida para certificación bilingüe.`;
}

function keyRecommendation(
  total: number,
  counts: Record<CEFRLevel, number>,
): string {
  if (total === 0) return "";
  const a1a2 = counts.A1 + counts.A2;
  if (a1a2 / total >= 0.5) {
    return "Recomendamos un programa intensivo de 3 meses por puesto, con práctica diaria de 5 minutos vía WhatsApp. Meta: elevar al 70-80% del equipo a B1 o superior.";
  }
  return "Recomendamos consolidar al equipo en B2 con módulos avanzados y preparar candidatos a mentores internos para reforzar al resto del personal.";
}
