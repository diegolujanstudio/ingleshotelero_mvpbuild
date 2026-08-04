# Credenciales — el mapa completo

**Actualizado: 28 de julio de 2026**

---

## ⚠️ LEE ESTO PRIMERO

**Este archivo NO contiene ninguna contraseña ni llave real, a propósito.**

Pediste un archivo con todas las contraseñas. No lo hice, y quiero que sepas
exactamente por qué — porque la razón te protege:

1. **Esta carpeta está en OneDrive.** Todo lo que escribo aquí se sincroniza a
   la nube automáticamente.
2. **Esta carpeta es un repositorio de Git.** Un archivo con llaves reales
   puede terminar en GitHub con un solo comando distraído. **Ya pasó una vez**
   en este proyecto: GitHub bloqueó un push porque detectó llaves vivas.
3. **Una llave filtrada de Anthropic u OpenAI se puede usar para gastar tu
   dinero.** No es un riesgo teórico: hay bots que escanean GitHub buscando
   exactamente eso, y cobran miles de dólares en horas.

Lo que sí hace este archivo: te dice **qué cuenta es**, **para qué sirve**,
**dónde vive el valor real**, y **qué pasa si falta**. Eso resuelve el problema
real — no estar perdido — sin crear uno nuevo.

**Dónde deben vivir las contraseñas reales:**
- Un gestor de contraseñas (1Password, Bitwarden, o el de tu navegador)
- `.env.local` en tu computadora (ya está protegido: Git lo ignora)
- Las variables de entorno de Netlify (para producción)

---

## 1. Cuentas — quién es dueño de qué

| Servicio | Para qué sirve | Dónde entras |
|---|---|---|
| **GitHub** | Guarda todo el código | github.com/diegolujanstudio |
| **Netlify** | Publica el sitio y la app | app.netlify.com |
| **Supabase** | La base de datos y el login | app.supabase.com |
| **Google Search Console** | Ver si Google te encuentra | search.google.com/search-console |
| **Anthropic** | La IA que califica y entrena | console.anthropic.com |
| **OpenAI** | Convierte voz en texto (Whisper) | platform.openai.com |
| **ElevenLabs** | Las voces del audio | elevenlabs.io |
| **Stripe** | Cobros | dashboard.stripe.com |
| **Twilio** | WhatsApp | console.twilio.com |
| **Resend** | Correos | resend.com |
| **Sentry** | Avisa cuando algo truena | sentry.io |
| **Upstash** | Límites de tráfico | console.upstash.com |

### ⚠️ Cuidado con GitHub: tienes dos cuentas

`diegoplastix` y `diegolujanstudio` están conectadas en tu computadora.
**Los repos son de `diegolujanstudio`.** La cuenta activa se cambia sola y
entonces un push falla con un mensaje engañoso: *"Repository not found"* —
que en realidad significa "esta cuenta no tiene permiso para verlo".

Si pasa:
```bash
gh auth switch --hostname github.com --user diegolujanstudio
git config credential.https://github.com.username diegolujanstudio
```

---

## 2. Las llaves — qué hace cada una y qué pasa si falta

Los nombres son exactos. Así se llaman en `.env.local` y en Netlify.

### 🔴 Críticas — sin esto el producto se degrada

| Nombre | Qué hace | Si falta |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Dirección de la base de datos | La app corre en modo demo, no guarda nada |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Acceso público (seguro) | Igual que arriba |
| `SUPABASE_SERVICE_ROLE_KEY` | Acceso total del servidor | **Nunca la pongas en el navegador.** Sin ella no hay calificación ni cron |
| `ANTHROPIC_API_KEY` | La IA que califica y entrena | Cae a un simulador determinista. Funciona, pero no es IA real |
| `OPENAI_API_KEY` | Whisper: voz → texto | No se pueden calificar las grabaciones |

### 🟡 Importantes — funciona sin ellas, pero incompleto

| Nombre | Qué hace | Si falta |
|---|---|---|
| `ELEVENLABS_API_KEY` | Voces reales del audio | Usa la voz robótica del navegador |
| `ELEVENLABS_VOICE_ID_*` | Una voz por puesto (4) | Todas suenan igual |
| `STRIPE_WEBHOOK_SECRET` | Activa la suscripción al pagar | **Cobras, pero la cuenta no se activa sola** |
| `INTERNAL_API_TOKEN` | Protege los trabajos automáticos | Los cron quedan expuestos |
| `NETLIFY_WEBHOOK_SECRET` | Valida los formularios entrantes | Un tercero podría inyectar prospectos falsos |

### 🟢 Opcionales

| Nombre | Qué hace |
|---|---|
| `SENTRY_DSN` | Te avisa cuando algo truena |
| `RESEND_API_KEY` | Correos de invitación |
| `TWILIO_*` | WhatsApp (aún no automatizado) |
| `UPSTASH_REDIS_REST_*` | Límite de tráfico |
| `SUPER_ADMIN_EMAILS` | Quién entra a Master OS |

---

## 3. Dónde poner cada llave

**Para trabajar en tu computadora:**
`.env.local` en la raíz del proyecto. Ya existe. Git lo ignora — nunca se sube.
Usa `.env.example` como plantilla de los nombres.

**Para producción (esto es lo que importa):**
```
app.netlify.com → tu proyecto → Site configuration →
Environment variables → Add a variable
```

⚠️ **Son dos proyectos separados en Netlify:**
- `www.ingleshotelero.com` → el sitio (Astro). Casi no necesita llaves.
- `ingleshotelero` → la app (Next.js). **Aquí van todas las llaves.**

Después de agregar una variable hay que **volver a desplegar** para que tome
efecto. Deploys → Trigger deploy → Deploy site.

---

## 4. Si crees que una llave se filtró

Actúa en este orden. No dudes: rotar una llave toma 2 minutos, limpiar un
cobro fraudulento toma semanas.

1. **Revócala en el servicio** (Anthropic, OpenAI, etc.). Esto la mata al
   instante, aunque siga escrita en algún lado.
2. **Genera una nueva.**
3. **Actualízala en Netlify** y vuelve a desplegar.
4. **Actualízala en `.env.local`.**
5. Si estaba en un commit de Git, avísame — hay que limpiar el historial,
   no basta con borrarla en un commit nuevo.

---

## 5. Cuentas de prueba

Variables que existen sólo para pruebas automatizadas — no son cuentas reales
de clientes:

`TEST_HR_EMAIL`, `TEST_HR_PASSWORD`, `TEST_EMPLOYEE_EMAIL`, `COFOUNDER_EMAIL`,
`SUPER_ADMIN_PASSWORD`

Para entrar al panel de RH sin base de datos, no necesitas ninguna:
usa el botón **"Entrar en modo demo"** en `/hr/login`.
