# Cómo publicar cambios

**Actualizado: 28 de julio de 2026**

---

## Lo esencial: son DOS proyectos separados

Esto confunde a todo el mundo, así que quede claro:

| | El sitio web | La aplicación |
|---|---|---|
| **URL** | www.ingleshotelero.com | app.ingleshotelero.com |
| **Carpeta** | `landing/` | la raíz del proyecto |
| **Tecnología** | Astro (páginas estáticas) | Next.js |
| **Repo de GitHub** | `ingleshotelero-landing` | `ingleshotelero_mvpbuild` |
| **Para quién** | Hoteles que aún no compran | Empleados y RH |

`landing/` es **su propio repositorio de Git** dentro de la carpeta principal.
Publicar uno no publica el otro.

---

## Publicar

Ambos se publican solos al hacer `push` a `main`. No hay botón que apretar.

**El sitio web:**
```bash
cd "Ingles Hotelero/landing"
npm run build          # siempre construye primero — si falla, no subas
git add -A
git commit -m "descripción de lo que cambió"
git push origin main
```

**La aplicación:**
```bash
cd "Ingles Hotelero"
npx tsc --noEmit       # revisa tipos
npm run build          # construye
git add -A
git commit -m "descripción"
git push origin main
```

Netlify tarda 1–3 minutos. Puedes ver el avance en app.netlify.com.

---

## ⚠️ PENDIENTE AHORA: correr la migración 0014

**Qué pasa si no la corres:** los 5 puestos nuevos (ama de llaves, concierge,
spa, seguridad, mantenimiento) existen en el código y en el mapa, pero la base
de datos los rechaza. Dar de alta a alguien de housekeeping va a fallar.
Todo lo demás funciona normal.

**Cómo correrla:**

1. Entra a **app.supabase.com** → tu proyecto
2. Si dice **"Paused"**, dale *Restore* y espera 2–3 minutos
3. Menú izquierdo → **SQL Editor** → *New query*
4. Abre el archivo `supabase/migrations/0014_role_modules.sql`
5. Copia **todo** el contenido y pégalo en el editor
6. Botón **Run**
7. Debe decir *Success*. Si dice error, mándamelo — no lo corras dos veces
   a ciegas.

**Cómo compruebas que sirvió:** entra al panel de RH, agrega un empleado y
elige "Ama de llaves". Si guarda, funcionó.

---

## Antes de publicar algo grande

```bash
# La app
npx tsc --noEmit      # 0 errores
npm run build         # exit 0

# El sitio
cd landing
npm run build
node scripts/check-links.mjs    # revisa las 1,079 páginas
```

`check-links.mjs` recorre todo el sitio construido y avisa de enlaces rotos e
imágenes faltantes. Debe decir `PASS`.

---

## Si algo sale mal

**Deshacer el último cambio publicado:**
```
app.netlify.com → tu proyecto → Deploys →
busca el deploy anterior que sí servía →
Publish deploy
```
Eso revierte en segundos, sin tocar código. Después arregla con calma.

**El push falla con "Repository not found":**
Es la cuenta de GitHub equivocada. Ver `01-CREDENCIALES.md` § GitHub.

**El sitio se ve viejo después de publicar:**
`Ctrl+Shift+R`. Si persiste, ver `02-PROBAR-LA-APP.md` § Problemas comunes.

---

## Después de publicar cambios en el sitio

Si agregaste o cambiaste páginas, avísale a Google:

1. **search.google.com/search-console**
2. Propiedad: **https://www.ingleshotelero.com/**
   (⚠️ la de `www` — la propiedad vieja sin www ya no sirve, porque el sitio
   se sirve desde www)
3. **URL Inspection** → pega la URL nueva → *Request indexing*

El sitemap ya está entregado y se actualiza solo en cada deploy. Sólo pide
indexación manual para páginas nuevas importantes.
