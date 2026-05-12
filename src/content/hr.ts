/**
 * HR dashboard — Spanish (es-MX) copy.
 *
 * Voice: warm but professional. Use "tú" when addressing the HR user
 * directly ("Bienvenido", "Tu equipo"). Use "ella/él/el empleado" for
 * third-person references. Editorial-dense — never marketing-flowery.
 *
 * `<em>` renders globally as non-italic, weight 500, ink-blue.
 */

export const META = {
  title: "Panel RH · Inglés Hotelero",
  description: "Panel de Recursos Humanos para hoteles.",
};

export const SHELL = {
  brand: "Inglés Hotelero",
  product: "Recursos Humanos",
  signOut: "Cerrar sesión",
  groupOps: "Operación",
  groupAdmin: "Administración",
  nav: {
    overview: "Resumen",
    employees: "Empleados",
    cohorts: "Cohortes",
    reports: "Reportes",
    team: "Equipo RH",
    settings: "Configuración",
  },
};

export const OVERVIEW = {
  eyebrow: "Resumen · Tu propiedad",
  headline: {
    before: "Tu equipo, ",
    em: "en números",
    after: ".",
  },
  sub: "Un vistazo a la actividad reciente, la distribución de niveles y los empleados que necesitan tu atención hoy.",
  metrics: {
    activeEmployees: { eyebrow: "Empleados activos", caption: "con estado activo" },
    examsLast30: { eyebrow: "Exámenes completados", caption: "últimos 30 días" },
    inProgress: { eyebrow: "Exámenes en curso", caption: "ahora mismo" },
    avgLevel: { eyebrow: "Nivel CEFR promedio", caption: "ponderado por activos" },
  },
  charts: {
    levelDistribution: {
      eyebrow: "Distribución",
      title: "Niveles CEFR",
      caption: "empleados activos por nivel actual",
    },
    activityByRole: {
      eyebrow: "Actividad",
      title: "Empleados por puesto",
      caption: "por módulo de hotelería",
    },
    weeklyExams: {
      eyebrow: "Tendencia",
      title: "Exámenes completados por semana",
      caption: "últimas 12 semanas",
    },
  },
  attention: {
    title: "Necesitan atención",
    sub: "Acciones sugeridas según la actividad reciente.",
    inactiveLabel: "Sin actividad >14 días",
    failedLabel: "Calificación fallida",
    overdueCohortLabel: "Cohortes vencidas sin completar",
    none: "Sin alertas activas. Buen trabajo.",
  },
  recentActivity: {
    title: "Actividad reciente",
    none: "Aún no hay actividad reciente.",
  },
};

export const EMPLOYEES = {
  eyebrow: "Operación · Talento",
  headline: {
    before: "Tu equipo, ",
    em: "uno por uno",
    after: ".",
  },
  sub: "Búsqueda, filtrado y edición rápida del estado de cada empleado.",
  search: "Buscar por nombre, email o departamento…",
  filters: {
    role: "Puesto",
    level: "Nivel",
    status: "Estado",
    all: "Todos",
  },
  actions: {
    new: "Nuevo empleado",
    import: "Importar CSV",
    export: "Exportar CSV",
    edit: "Editar",
    archive: "Archivar",
    delete: "Eliminar",
    bulkArchive: "Archivar selección",
  },
  table: {
    name: "Nombre",
    role: "Puesto",
    level: "Nivel",
    department: "Departamento",
    shift: "Turno",
    status: "Estado",
    whatsapp: "WhatsApp",
    lastActive: "Últ. actividad",
    actions: "Acciones",
  },
  status: {
    active: "Activo",
    paused: "Pausado",
    inactive: "Inactivo",
    promoted: "Promovido",
    terminated: "Removido",
  },
  shift: {
    morning: "Matutino",
    afternoon: "Vespertino",
    night: "Nocturno",
  },
  source: {
    self_registered: "Auto-registrado",
    hr_invited: "Invitado por RH",
    csv_imported: "Importado CSV",
  },
  empty: "Sin empleados que coincidan con los filtros.",
  liveBadge: "en vivo",
  drawer: {
    titleEdit: "Editar empleado",
    titleNew: "Nuevo empleado",
    sectionContact: "Contacto",
    sectionWork: "Puesto y turno",
    sectionPrefs: "Preferencias",
    sectionCohorts: "Cohortes",
    name: "Nombre completo",
    email: "Email",
    phone: "Teléfono / WhatsApp",
    department: "Departamento",
    role: "Puesto",
    shift: "Turno",
    status: "Estado",
    whatsappOpt: "Recibe drills por WhatsApp",
    cohortAssign: "Cohortes asignadas",
    cancel: "Cancelar",
    save: "Guardar cambios",
    saving: "Guardando…",
    saved: "Cambios guardados.",
    saveError: "No se pudo guardar. Revisa los campos.",
    deleteConfirm:
      "¿Marcar este empleado como removido? Sus datos se conservan pero no aparecerán en la operación diaria.",
  },
};

export const EMPLOYEE_DETAIL = {
  eyebrow: "Empleado",
  back: "Volver a la lista",
  edit: "Editar",
  exportPdf: "Exportar reporte PDF",
  sections: {
    contact: "Contacto",
    exam: "Examen de colocación",
    practice: "Práctica diaria",
    recommendations: "Recomendaciones",
    timeline: "Actividad reciente",
  },
  contact: {
    email: "Email",
    phone: "Teléfono",
    department: "Departamento",
    shift: "Turno",
    source: "Origen del registro",
    createdAt: "Registrado el",
    none: "—",
  },
  exam: {
    none: "Aún no hay examen completado.",
    combined: "Puntaje combinado",
    listening: "Comprensión auditiva",
    speaking: "Expresión oral",
    completedAt: "Completado el",
    transcripts: "Respuestas habladas",
    rubric: "60% habla + 40% escucha",
  },
  practice: {
    streak: "Racha actual",
    streakLongest: "Racha máxima",
    drills30: "Drills últimos 30 días",
    completion: "Completitud",
    none: "Aún no ha iniciado práctica diaria.",
  },
  timeline: {
    examStarted: "Inició examen",
    examCompleted: "Completó examen",
    practiceCompleted: "Completó drill",
    levelUpdated: "Cambio de nivel a",
    none: "Sin eventos recientes.",
  },
  recommendations: {
    none: "Sin recomendaciones específicas en este momento.",
  },
};

export const COHORTS = {
  eyebrow: "Operación · Cohortes",
  headline: {
    before: "Cohortes de ",
    em: "entrenamiento",
    after: ".",
  },
  sub: "Agrupa empleados por puesto y nivel objetivo. Mide el avance del grupo en el tiempo.",
  actions: {
    new: "Nueva cohorte",
    edit: "Editar",
    archive: "Archivar",
  },
  table: {
    name: "Nombre",
    module: "Módulo",
    target: "Nivel meta",
    members: "Miembros",
    progress: "Progreso",
    start: "Inicio",
    end: "Cierre",
    status: "Estado",
    actions: "Acciones",
  },
  status: {
    draft: "Borrador",
    active: "Activa",
    completed: "Completada",
    archived: "Archivada",
  },
  empty: "Sin cohortes. Crea la primera para empezar a agrupar empleados.",
  modal: {
    title: "Nueva cohorte",
    titleEdit: "Editar cohorte",
    name: "Nombre de la cohorte",
    namePlaceholder: "Ej. Recepción Q3 2026",
    module: "Módulo",
    targetLevel: "Nivel meta",
    startDate: "Fecha de inicio",
    endDate: "Fecha de cierre",
    completionTarget: "Meta de completitud (%)",
    cancel: "Cancelar",
    create: "Crear cohorte",
    save: "Guardar",
    saving: "Guardando…",
  },
  detail: {
    addMember: "Añadir miembro",
    removeMember: "Quitar",
    membersTitle: "Miembros",
    progressTitle: "Avance de la cohorte",
    none: "Aún no hay miembros en esta cohorte.",
    addMemberSearch: "Busca un empleado por nombre…",
  },
};

export const REPORTS = {
  eyebrow: "Reportes · Exportación",
  headline: {
    before: "Reporte ",
    em: "ejecutivo",
    after: ".",
  },
  sub: "Filtra por cohorte, puesto, nivel o rango de fechas y exporta en PDF, Excel o CSV.",
  filters: {
    cohort: "Cohorte",
    role: "Puesto",
    level: "Nivel",
    from: "Desde",
    to: "Hasta",
    apply: "Aplicar filtros",
    reset: "Limpiar",
    all: "Todos",
  },
  preview: {
    title: "Vista previa",
    employees: "Empleados",
    avg: "Puntaje promedio",
    active: "Activos esta semana",
    participation: "Participación",
  },
  actions: {
    pdf: "Generar PDF",
    excel: "Exportar Excel",
    csv: "Exportar CSV",
    generating: "Generando…",
  },
  toast: {
    pdfReady: "PDF generado.",
    excelReady: "Excel generado.",
    csvReady: "CSV generado.",
    error: "No se pudo generar el reporte.",
  },
};

export const SETTINGS = {
  eyebrow: "Configuración · Cuenta",
  headline: {
    before: "Configuración de ",
    em: "tu propiedad",
    after: ".",
  },
  sub: "Datos de tu organización y propiedad. Cambios visibles para todo el equipo RH.",
  tabs: {
    org: "Organización",
    property: "Propiedad",
  },
  org: {
    name: "Nombre legal",
    billingEmail: "Email de facturación",
    tier: "Plan actual",
    status: "Estado de la suscripción",
    type: "Tipo",
  },
  property: {
    name: "Nombre del hotel",
    slug: "URL pública (slug)",
    city: "Ciudad",
    state: "Estado",
    country: "País",
    rooms: "Número de habitaciones",
    timezone: "Zona horaria",
  },
  save: "Guardar cambios",
  saving: "Guardando…",
  saved: "Cambios guardados.",
  error: "No se pudo guardar.",
  readOnly: "Solo lectura — contacta soporte para modificar.",
};

export const TEAM = {
  eyebrow: "Equipo · Acceso",
  headline: {
    before: "Equipo de ",
    em: "Recursos Humanos",
    after: ".",
  },
  sub: "Usuarios con acceso al panel. Invita más administradores o consultores con permisos limitados.",
  actions: {
    invite: "Invitar usuario",
  },
  table: {
    name: "Nombre",
    email: "Email",
    role: "Rol",
    lastLogin: "Último acceso",
    status: "Estado",
    actions: "Acciones",
  },
  role: {
    super_admin: "Super-admin",
    org_admin: "Admin organización",
    property_admin: "Admin propiedad",
    viewer: "Visualizador",
  },
  status: {
    active: "Activo",
    pending: "Pendiente",
    inactive: "Inactivo",
  },
  empty: "Aún no hay otros usuarios en el equipo.",
  never: "Nunca",
  modal: {
    title: "Invitar usuario",
    name: "Nombre completo",
    email: "Email",
    role: "Rol",
    cancel: "Cancelar",
    send: "Enviar invitación",
    sending: "Enviando…",
    sent: "Invitación enviada.",
    error: "No se pudo enviar la invitación.",
  },
};

export const COMMON = {
  loading: "Cargando…",
  empty: "Sin datos.",
  demoBadge: "Modo demo",
  yes: "Sí",
  no: "No",
  cancel: "Cancelar",
  confirm: "Confirmar",
  delete: "Eliminar",
  close: "Cerrar",
  pageOf: (page: number, total: number) =>
    `Página ${page} de ${Math.max(total, 1)}`,
};

export const EMPLOYEE_STATUS_VALUES = [
  "active",
  "paused",
  "inactive",
  "promoted",
  "terminated",
] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUS_VALUES)[number];
