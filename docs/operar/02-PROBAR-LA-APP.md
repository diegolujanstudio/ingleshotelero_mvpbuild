# Cómo probar la app

**Actualizado: 28 de julio de 2026**

La app es una **PWA** — una página web que se instala en el teléfono como si
fuera una app, pero sin App Store, sin descarga y sin contraseña. Así es como
la va a usar un botones en su turno, y así es como debes probarla tú.

**La app vive en:** https://ingleshotelero.netlify.app

---

## Prueba rápida (5 minutos, desde tu teléfono)

Esto es lo que le enseñas a un hotel en una junta.

### 1. Abre la app en tu teléfono
Ve a **ingleshotelero.netlify.app** en Chrome o Safari.

### 2. Instálala en la pantalla de inicio
- **Android/Chrome:** menú ⋮ → *Agregar a pantalla principal*
- **iPhone/Safari:** botón compartir → *Añadir a inicio*

Ahora tienes un ícono como cualquier app. **Ábrela desde ahí, no desde el
navegador** — así la ve el empleado, a pantalla completa y sin barra de
direcciones.

### 3. Prueba la práctica diaria
```
/practice?role=frontdesk&level=A2
```
Cambia `role` por: `frontdesk`, `bellboy`, `restaurant`, `housekeeping`,
`concierge`, `spa`, `security`, `maintenance`
Cambia `level` por: `A1`, `A2`, `B1`, `B2`

Vas a ver el ciclo de 4 pasos: escuchar → responder con la voz → reforzar la
frase modelo → repasar vocabulario.

**Fíjate en esto:** al responder con la voz, **no aparece ninguna
calificación.** Dice "Te entendí" y luego "Otra forma de decirlo". Eso es
deliberado — es la Ley 1 del método. Si algún día ves un número del 0 al 100
ahí, es un bug.

### 4. Prueba el entrenador de pronunciación
```
/practice/pronunciacion
```
Escucha una palabra, elige cuál oíste. Verde o rojo, sin medias tintas.
Cambia de sonido con `?c=long_i_short_i`, `?c=ch_sh`, `?c=b_v`, `?c=s_onset`.

**Esto es lo mejor para vender.** Un director de RH que escucha una vez el
problema de "beach" nunca lo olvida — y entiende de inmediato por qué su
personal evita hablar con los huéspedes.

### 5. Prueba el panel de RH
```
/hr/login  →  botón "Entrar en modo demo"
```
No necesitas contraseña. Entra con 12 empleados de ejemplo para que se vea
poblado en una demo.

---

## Probar sin conexión (el caso real)

Tu usuario trabaja en un sótano sin señal. Pruébalo así:

1. Abre la práctica y **deja que cargue** el primer paso.
2. Activa **modo avión**.
3. Sigue contestando. **No debe tronar** — las respuestas se guardan en el
   teléfono.
4. Quita el modo avión. Las respuestas se sincronizan solas.

Si ves una pantalla de error en vez de seguir funcionando, eso es un bug real.

---

## Probar en tu computadora

```bash
cd "Ingles Hotelero"
npm install
npm run dev
```
Abre http://localhost:3000

Sin base de datos configurada corre en **modo demo**: contenido real,
calificación simulada, nada se guarda. Suficiente para revisar diseño y flujo.

Para ver el sitio web (no la app):
```bash
cd landing
npm install
npm run dev
```
Abre http://localhost:4321

---

## Qué revisar en una demo con un hotel

En este orden. Son 10 minutos.

1. **`/metodo` en el sitio** — el mapa del sistema. Enséñale que no es un
   curso, es un sistema. Arrastra el mapa, haz clic en un nodo.
2. **`/practice/pronunciacion`** — el problema de la pena, en 60 segundos.
3. **`/practice`** — el ciclo diario de 5 minutos.
4. **`/hr/login` → modo demo** — lo que él va a ver: el nivel real de su
   personal, un número que nunca ha tenido.
5. **`/precios` en el sitio** — mueve la calculadora con SUS números de
   plantilla y rotación.

---

## Problemas comunes

**"Veo una versión vieja del sitio"**
Ya está resuelto con un kill switch, pero si reaparece en algún dispositivo:
`Ctrl+Shift+R` (Windows) o `Cmd+Shift+R` (Mac). Si persiste, en Chrome:
F12 → Application → Service Workers → Unregister.

**"El micrófono no funciona"**
El navegador necesita permiso y **HTTPS**. En `localhost` funciona; en una IP
local (`192.168.x.x`) no. Prueba desde la URL real de Netlify.

**"No hay audio"**
Sin `ELEVENLABS_API_KEY` usa la voz del navegador, que suena robótica pero
sirve. Ver `01-CREDENCIALES.md`.

**"No puedo dar de alta a alguien de housekeeping"**
Falta correr la migración `0014`. Los 5 puestos nuevos existen en el código
pero la base de datos todavía no los acepta. Ver `03-DESPLEGAR.md`.

**"Todo se ve en modo demo"**
Faltan las variables de Supabase en Netlify, o el proyecto de Supabase está
pausado (plan gratuito). Ver `01-CREDENCIALES.md`.
