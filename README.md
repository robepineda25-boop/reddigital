# Red Digital Honduras · sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de compilación) para Red Digital Honduras.
Pensado para publicarse en **Netlify** conectado a un repositorio de **GitHub**.

Todo el sitio está en la carpeta `reddigital-web/`. Las rutas de archivos de este documento (`index.html`, `assets/js/config.js`, etc.) son relativas a esa carpeta. Este README está fuera de ella a propósito, para que no se publique en el sitio.

## Estructura

```
reddigital-web/
├── index.html            Página principal (un solo llamado a la acción: "Agende 30 minutos sin costo")
├── privacidad.html       Política de privacidad (incluye sección de cookies)
├── terminos.html         Términos y condiciones
├── 404.html              Página de error personalizada (Netlify la usa sola)
├── gracias.html          Confirmación después de enviar el formulario
├── robots.txt / sitemap.xml
├── site.webmanifest      Íconos para celular
├── favicon.ico / favicon.svg / favicon-32x32.png / apple-touch-icon.png / icon-192.png / icon-512.png
├── netlify.toml          HTTPS, dominio canónico, cabeceras de seguridad y caché
├── .gitignore
└── assets/
    ├── css/styles.css
    ├── js/config.js      ID público de Google Analytics (no es secreto)
    ├── js/main.js        Menú, calculadora, validación del formulario, banner de cookies, GA4
    ├── fonts/            Plus Jakarta Sans en woff2 (alojada aquí, sin Google Fonts)
    └── img/              Imágenes WebP + JPG de respaldo, logo SVG, imagen para redes (og-image.jpg)
```

## Cómo está publicado

Dirección del sitio: **https://reddigitalhn.netlify.app** (gratis, con HTTPS incluido). Publicado desde el 2026-11-01.

| Qué | Valor |
|---|---|
| Repositorio | `robepineda25-boop/reddigital` en GitHub, rama `main`. El sitio está en la subcarpeta `reddigital-web/` |
| Proyecto de Netlify | `reddigitalhn` |
| *Base directory* | `reddigital-web` |
| *Build command* | vacío (no hay paso de compilación) |
| *Publish directory* | `.` (lo fija `netlify.toml`, relativo a `reddigital-web`) |
| Formulario | Netlify Forms, formulario `contacto`, con notificación por correo |
| Google Analytics 4 | ID en `assets/js/config.js` |

Cada `git push` a `main` vuelve a publicar el sitio en uno o dos minutos.

### Si hay que volver a conectarlo en Netlify

1. app.netlify.com → **Add new project → Import an existing project → GitHub** → elija `reddigital`.
2. *Branch* `main` · *Base directory* `reddigital-web` · *Build command* vacío → **Deploy**. Si el nombre `reddigitalhn` ya no está disponible, cambie la dirección en los `.html`, `sitemap.xml` y `robots.txt` (busque `reddigitalhn.netlify.app`).
3. **Forms → Enable form detection**, luego **Deploys → Trigger deploy → Deploy project**. Después **Forms → Form notifications → Add notification → Email** con su correo.

### Cuando compre un dominio
Netlify → **Domain management → Add a domain**, apunte el DNS como le indique Netlify y reemplace `https://reddigitalhn.netlify.app` por el dominio nuevo en los `.html`, `sitemap.xml` y `robots.txt`.

## Pendientes

- [x] `privacidad.html` y `terminos.html`: razón social, RTN y dirección completos (2026-11-01).
- [x] `assets/js/config.js`: ID real de GA4 (`G-6KJC6TS0JZ`).
- [x] Google Search Console verificado con la etiqueta `google-site-verification` de `index.html`. No la borre.
- [ ] Pedir a un abogado hondureño que revise `privacidad.html` y `terminos.html`.

## Lista de control (20 puntos)

| # | Punto | Dónde está |
|---|---|---|
| 1 | Política de privacidad | `privacidad.html` |
| 2 | Términos y condiciones | `terminos.html` |
| 3 | Sin secretos en el frontend | No hay claves; el ID de GA4 es público por diseño. Netlify Forms no necesita clave |
| 4 | Forzar HTTPS | Netlify fuerza HTTPS en `*.netlify.app`; `netlify.toml` agrega HSTS y `upgrade-insecure-requests` |
| 5 | Banner de cookies | `main.js`: GA4 no carga hasta que la persona pulsa "Aceptar" (Consent Mode v2) |
| 6 | Título y descripción | `<title>` y `meta description` en cada página |
| 7 | Imagen para redes | `assets/img/og-image.jpg` (1200×630) con etiquetas Open Graph y Twitter |
| 8 | Favicon | `.ico`, `.svg`, PNG 32/180/192/512 |
| 9 | Sitemap y robots | `sitemap.xml`, `robots.txt` |
| 10 | Texto alternativo | Todas las imágenes con contenido tienen `alt`; el fondo del hero es decorativo (`alt=""`) |
| 11 | Imágenes comprimidas | WebP: hero 438 KB → 13–39 KB; foto 473 KB → 5–12 KB |
| 12 | Velocidad | Lighthouse: móvil 99, escritorio 100 en rendimiento |
| 13 | Contraste | Todos los pares de color pasan WCAG AA (verificado) |
| 14 | Móvil | Diseño desde 320 px, menú desplegable, botones de 44–48 px |
| 15 | 404 personalizada | `404.html` |
| 16 | Enlaces rotos | Revisión automática: 0 enlaces internos rotos |
| 17 | Validación del formulario | `main.js`: mensajes en español, número hondureño de 8 dígitos |
| 18 | Protección contra spam | Campo trampa (honeypot) + filtro de Netlify + bloqueo de envíos en menos de 3 s |
| 19 | Analítica | GA4 con consentimiento; eventos `generate_lead` y `contact_whatsapp` |
| 20 | Un solo llamado a la acción | "Agende 30 minutos sin costo" → formulario `#contacto` |

## Alternativa: GitHub Pages

Funciona, pero pierde dos cosas: el formulario de Netlify (tendría que usar Formspree u otro servicio y cambiar el `action` del formulario) y las cabeceras de seguridad de `netlify.toml`. HTTPS se activa en **Settings → Pages → Enforce HTTPS**. Por eso se recomienda Netlify.

## Probar en su computadora

```bash
cd reddigital-web
python -m http.server 8000
```
Abra http://localhost:8000. El formulario solo envía de verdad una vez publicado en Netlify.
