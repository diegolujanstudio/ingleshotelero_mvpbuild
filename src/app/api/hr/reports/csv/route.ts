import { NextResponse } from "next/server";
import { getHRUser } from "@/lib/auth/session";
import { jsonError } from "@/lib/server/api";
import { loadEmployees } from "@/lib/hr/data";
import { ROLES } from "@/content/roles";
import { toCsv } from "@/lib/masteros/csv";

/**
 * GET /api/hr/reports/csv — flat CSV export for the caller's scope.
 */
export async function GET() {
  const user = await getHRUser();
  if (!user) return jsonError("unauthorized", "No autenticado.", 401);
  const employees = await loadEmployees(user);

  const csv = toCsv(employees, [
    { key: "name", header: "Nombre" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Teléfono" },
    { key: "hotel_role", header: "Puesto", accessor: (e) => ROLES[e.hotel_role].label_es },
    { key: "department", header: "Departamento" },
    { key: "shift", header: "Turno" },
    { key: "current_level", header: "Nivel" },
    { key: "is_active", header: "Activo", accessor: (e) => (e.is_active ? "Sí" : "No") },
    { key: "combined_score", header: "Puntaje" },
    { key: "listening_score", header: "Escucha" },
    { key: "speaking_score", header: "Habla" },
    { key: "streak", header: "Racha" },
    { key: "practice_completion_pct", header: "Completitud %" },
    { key: "exam_completed_at", header: "Examen completado" },
  ]);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="reporte-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
