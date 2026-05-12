/**
 * Masteros — internal admin OS copy.
 *
 * Spanish, formal-Mexican-business tone. This is Diego's internal tool;
 * everyone who sees it is the founder or someone he hands a laptop to.
 * Direct, dense, no marketing rhetoric.
 *
 * `<em>` renders globally as non-italic, weight 500, ink-blue.
 */

export const META = {
  title: "Masteros · Inglés Hotelero",
  description: "Panel de control interno.",
};

export const SHELL = {
  brand: "Inglés Hotelero",
  product: "Masteros",
  signOut: "Cerrar sesión",
  groupMain: "Operación",
  groupSoon: "Próximamente",
  nav: {
    dashboard: "Dashboard",
    modules: "Módulos",
    crm: "CRM",
    journey: "Journey",
    cohorts: "Cohortes",
    audit: "Auditoría",
    system: "Sistema",
  },
};

export const DASHBOARD = {
  eyebrow: "Tablero · Vista en vivo",
  headline: {
    before: "El producto, ",
    em: "ahora mismo",
    after: ".",
  },
  sub: "Métricas en tiempo real de toda la plataforma. Refrescar para actualizar.",
  refresh: "Refrescar",
  refreshing: "Cargando…",
  cards: {
    activeEmployees: {
      eyebrow: "Empleados activos",
      caption: "últimos 7 días",
    },
    examsCompleted: {
      eyebrow: "Exámenes completados",
      caption: "últimos 30 días",
    },
    scoringQueue: {
      eyebrow: "Cola de calificación",
      caption: "pendientes + en proceso",
    },
  },
  charts: {
    daily: {
      eyebrow: "Actividad diaria",
      title: "Empleados activos por día",
      caption: "últimos 30 días · prácticas + exámenes",
    },
    levels: {
      eyebrow: "Distribución",
      title: "Niveles CEFR — instantánea",
      caption: "empleados con examen completado",
    },
    drills: {
      eyebrow: "Práctica diaria",
      title: "Drills completados vs invitados",
      caption: "últimos 30 días",
    },
    cost: {
      eyebrow: "Costo IA estimado",
      title: "Gasto por proveedor",
      caption: "últimos 7 días · USD",
      assumption:
        "Estimación: $0.006/min Whisper, $0.02/scoring Claude, $0.30/1K caracteres ElevenLabs.",
    },
  },
  empty: "Sin datos suficientes en este rango.",
  error: "No se pudo cargar la métrica.",
};

export const MODULES = {
  eyebrow: "Catálogo · Contenido",
  headline: {
    before: "Módulos de ",
    em: "contenido",
    after: ".",
  },
  sub: "Cada fila es un item de práctica, listening o vocabulario. Editar como JSON.",
  search: "Buscar por texto, palabra o tópico…",
  filters: {
    module: "Módulo",
    level: "Nivel",
    skill: "Habilidad",
    type: "Tipo",
    all: "Todos",
  },
  actions: {
    new: "Nuevo item",
    import: "Importar JSON",
    export: "Exportar JSON",
    edit: "Editar",
    duplicate: "Duplicar",
    toggleActive: "Activar/desactivar",
    delete: "Eliminar",
  },
  table: {
    module: "Módulo",
    level: "Nivel",
    skill: "Habilidad",
    type: "Tipo",
    preview: "Vista previa",
    usage: "Usos",
    updated: "Actualizado",
    active: "Activo",
    actions: "Acciones",
  },
  drawer: {
    title: "Editar item",
    titleNew: "Nuevo item",
    diff: "Cambios pendientes",
    cancel: "Cancelar",
    save: "Guardar",
    saving: "Guardando…",
    invalidJson: "JSON inválido",
    schemaError: "Esquema inválido",
  },
  empty: "Sin items que coincidan con los filtros.",
  pagination: {
    of: "de",
    page: "Página",
    prev: "Anterior",
    next: "Siguiente",
  },
  delete: {
    confirm: "¿Eliminar este item? No se puede deshacer.",
  },
};

export const IMPORT = {
  eyebrow: "Catálogo · Importación masiva",
  headline: {
    before: "Importar ",
    em: "JSON",
    after: ".",
  },
  sub: "Pegar un arreglo de items. Validar antes de aplicar. UPSERT por id si está presente.",
  step1: {
    title: "1 · Pegar JSON",
    placeholder: '[{ "module": "bellboy", "level": "A1", ... }]',
    parse: "Validar",
  },
  step2: {
    title: "2 · Revisar",
    valid: "items válidos",
    invalid: "con errores",
    insert: "nuevos",
    update: "a actualizar",
    apply: "Aplicar",
    applying: "Aplicando…",
    back: "Volver",
  },
  step3: {
    title: "3 · Resultado",
    success: "Importación completada",
    inserted: "insertados",
    updated: "actualizados",
    failed: "con errores",
    again: "Importar otro lote",
  },
  error: {
    notArray: "El JSON debe ser un arreglo de items.",
    parseFailed: "No se pudo parsear el JSON.",
  },
};

export const CRM = {
  eyebrow: "Comercial · Relaciones",
  headline: {
    before: "CRM ",
    em: "interno",
    after: ".",
  },
  sub: "Organizaciones, propiedades, usuarios RH y notas. MRR manual hasta integrar Stripe.",
  search: "Buscar organización…",
  exportCsv: "Exportar CSV",
  status: {
    pilot: "Piloto",
    paid: "Pagado",
    churned: "Churn",
  },
  table: {
    org: "Organización",
    plan: "Plan",
    status: "Estado",
    properties: "Hoteles",
    employees: "Empleados",
    lastLogin: "Último acceso",
    notes: "Notas",
    actions: "Acciones",
    view: "Ver",
  },
  drawer: {
    title: "Detalle",
    properties: "Hoteles",
    hrUsers: "Usuarios RH",
    notesLabel: "Notas internas",
    notesPlaceholder: "Contexto, próximos pasos, riesgos…",
    save: "Guardar notas",
    saving: "Guardando…",
    close: "Cerrar",
    noProperties: "Sin hoteles registrados.",
    noUsers: "Sin usuarios RH.",
    never: "Nunca",
  },
  empty: "Sin organizaciones.",
};

export const NOT_AUTHORIZED = {
  title: "Acceso denegado",
  body: "Esta superficie es exclusiva para super-administradores.",
  link: "Volver al inicio",
};
