import { NextResponse } from "next/server";
import { z } from "zod";
import { getHRUser } from "@/lib/auth/session";
import { jsonError, parseBody } from "@/lib/server/api";
import { loadEmployees, loadPropertyInfo } from "@/lib/hr/data";
import { buildReportPdf } from "@/lib/hr/pdf";

const Schema = z.object({
  filters: z
    .object({
      cohort: z.string().optional(),
      role: z.union([z.enum(["bellboy", "frontdesk", "restaurant"]), z.literal("all")]).optional(),
      level: z.union([z.enum(["A1", "A2", "B1", "B2"]), z.literal("all")]).optional(),
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
  employeeIds: z.array(z.string()).optional(),
});

/**
 * POST /api/hr/reports/pdf — render the executive PDF for the caller's
 * scope. Filters are applied on the server so the result is reproducible.
 */
export async function POST(req: Request) {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const parsed = await parseBody(req, Schema, "/api/hr/reports/pdf");
  if (!parsed.ok) return parsed.response;

  const employees = await loadEmployees(user);
  const property = await loadPropertyInfo(user);

  const ids = parsed.data.employeeIds ? new Set(parsed.data.employeeIds) : null;
  const filtered = employees.filter((e) => {
    if (ids && !ids.has(e.id)) return false;
    const f = parsed.data.filters;
    if (f?.role && f.role !== "all" && e.hotel_role !== f.role) return false;
    if (f?.level && f.level !== "all" && e.current_level !== f.level) return false;
    if (f?.from && e.exam_completed_at && e.exam_completed_at.slice(0, 10) < f.from) return false;
    if (f?.to && e.exam_completed_at && e.exam_completed_at.slice(0, 10) > f.to) return false;
    return true;
  });

  const bytes = buildReportPdf({
    propertyName: property.name,
    generatedAt: new Date(),
    filters: parsed.data.filters,
    employees: filtered,
  });

  return new NextResponse(bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="reporte-${new Date().toISOString().slice(0, 10)}.pdf"`,
    },
  });
}
