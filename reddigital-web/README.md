# Red Digital Honduras · sitio web

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni paso de compilación) para Red Digital Honduras.
Pensado para publicarse en **Netlify** conectado a un repositorio de **GitHub**.

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

## Publicar gratis (sin dominio propio, ~20 minutos)

Dirección del sitio: **https://reddigitalhn.netlify.app** (gratis, con HTTPS incluido).

1. **GitHub:** cree el repositorio `reddigital-web` → en la página vacía, enlace **uploading an existing file** → arrastre TODO el contenido de esta carpeta (no la carpeta en sí) → **Commit changes**. En la raíz del repositorio debe verse `index.html`.
2. **Netlify:** app.netlify.com → **Sign up with GitHub** → **Add new project → Import an existing project → GitHub** → elija `reddigital-web`.
3. **Configuración:** *Project name* `reddigitalhn` · *Branch* `main` · *Build command* vacío · *Publish directory* vacío → **Deploy**. Si `reddigitalhn` ya está tomado, elija otro nombre y cámbielo también en los `.html`, `sitemap.xml` y `robots.txt` (busque `reddigitalhn.netlify.app`).
4. **Formulario:** **Forms → Enable form detection**, luego **Deploys → Trigger deploy → Deploy project**. Después **Forms → Form notifications → Add notification → Email** con su correo.
5. **Google Analytics 4:** pegue su ID `G-…` en `assets/js/config.js` (en GitHub: abrir el archivo → lápiz → **Commit changes**).

Cada cambio que guarde en GitHub vuelve a publicar el sitio en uno o dos minutos.

### Cuando compre un dominio
Netlify → **Domain management → Add a domain**, apunte el DNS como le indique Netlify y reemplace `https://reddigitalhn.netlify.app` por el dominio nuevo en los `.html`, `sitemap.xml` y `robots.txt`.

## Pendientes antes de publicar

- [ ] `privacidad.html` y `terminos.html`: reemplace **[RAZÓN SOCIAL O NOMBRE DEL TITULAR]**, **[RTN]**, **[DIRECCIÓN, CIUDAD]** y **[CIUDAD]**, y pida a un abogado hondureño que revise ambos textos.
- [ ] `assets/js/config.js`: ID real de GA4.
- [ ] Al publicar: registrar el sitio en Google Search Console y enviar `https://reddigitalhn.netlify.app/sitemap.xml`.

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
