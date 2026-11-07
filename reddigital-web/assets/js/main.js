/* Red Digital Honduras · main.js (sin dependencias, sin secretos) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  // Animaciones solo si la persona no pidió reducir el movimiento y el navegador lo permite.
  var animar = !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) &&
    "IntersectionObserver" in window && "requestAnimationFrame" in window;

  /* ---------- Año del pie ---------- */
  var anio = $("#anio");
  if (anio) anio.textContent = String(new Date().getFullYear());

  /* ---------- Menú móvil ---------- */
  var toggle = $(".nav-toggle"), menu = $("#menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
    });
  }

  /* ---------- Calculadora ---------- */
  var calc = $("#calc");
  if (calc) {
    var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) && v > 0 ? v : 0; };
    var fmt = function (n) { return Math.round(n).toLocaleString("es-HN"); };
    var costoMes = 0, contando = false;
    var update = function () {
      contando = false;
      var minutos = num("#c-min"), veces = num("#c-veces"), personas = num("#c-personas");
      var salario = num("#c-salario"), retrabajo = Math.min(num("#c-retrabajo"), 100) / 100;
      var costoHora = salario * 14 / 12 * 1.10 / 190.5;
      var horasMes = minutos * veces * personas * (1 + retrabajo) * 4.33 / 60;
      costoMes = horasMes * costoHora;
      $("#r-hora").textContent = "L " + fmt(costoHora);
      $("#r-horas").textContent = fmt(horasMes);
      $("#r-mes").textContent = "L " + fmt(costoMes);
      $("#r-anio").textContent = "L " + fmt(costoMes * 12);
    };
    calc.addEventListener("input", update);
    calc.addEventListener("submit", function (e) { e.preventDefault(); });
    update();

    // La primera vez que se ven los resultados, el costo al mes y al año suben de 0 a la cifra.
    var resultados = $(".calc-results");
    if (animar && resultados) {
      var subir = function () {
        var inicio = performance.now(), duracion = 900;
        contando = true;
        resultados.setAttribute("aria-busy", "true"); // que el lector de pantalla no lea cada número intermedio
        $("#r-mes").textContent = "L 0";
        $("#r-anio").textContent = "L 0";
        var paso = function (ahora) {
          if (!contando) { resultados.removeAttribute("aria-busy"); return; } // la persona ya está escribiendo
          var p = Math.min((ahora - inicio) / duracion, 1), avance = 1 - Math.pow(1 - p, 3);
          $("#r-mes").textContent = "L " + fmt(costoMes * avance);
          $("#r-anio").textContent = "L " + fmt(costoMes * 12 * avance);
          if (p < 1) { requestAnimationFrame(paso); return; }
          contando = false;
          resultados.removeAttribute("aria-busy");
        };
        requestAnimationFrame(paso);
      };
      var vigiaCalc = new IntersectionObserver(function (entradas) {
        if (!entradas[0].isIntersecting) return;
        vigiaCalc.disconnect();
        subir();
      }, { threshold: 0.6 });
      vigiaCalc.observe(resultados);
    }
  }

  /* ---------- Aparición suave al bajar (sin librerías) ---------- */
  if (animar) {
    var bloques = $$(".lead-quote, .section .wrap > .eyebrow, .section .wrap > h2, .grid > *, " +
      ".calc-intro, .calc-box, .about > *, .faq > details, .contact > *");
    var vigia = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        vigia.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    // Primero se miden todos los bloques y después se cambian, para que el navegador calcule la página una sola vez.
    var alto = window.innerHeight;
    var yaVisibles = bloques.map(function (el) {
      var r = el.getBoundingClientRect();
      return r.top < alto && r.bottom > 0;
    });
    bloques.forEach(function (el, i) {
      if (yaVisibles[i]) return; // lo que ya se ve al cargar no se esconde
      el.classList.add("reveal");
      var padre = el.parentNode;
      if (padre.classList.contains("grid")) {
        el.style.transitionDelay = (Array.prototype.indexOf.call(padre.children, el) * 80) + "ms";
      }
      vigia.observe(el);
    });
  }

  /* ---------- Formulario de contacto: validación + antispam ---------- */
  var form = $("#form-contacto");
  if (form) {
    var cargado = Date.now();
    var setErr = function (input, msgEl, msg) {
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      msgEl.textContent = msg || "";
      return !msg;
    };
    var reglas = {
      nombre: function (v) {
        v = v.trim();
        if (!v) return "Escriba su nombre.";
        if (v.length < 2) return "El nombre es muy corto.";
        if (v.length > 80) return "Máximo 80 caracteres.";
        if (/https?:\/\/|www\./i.test(v)) return "El nombre no puede llevar enlaces.";
        return "";
      },
      whatsapp: function (v) {
        var d = v.replace(/[\s\-().]/g, "").replace(/^\+?504/, "");
        if (!d) return "Escriba su número de WhatsApp.";
        if (!/^[2-9]\d{7}$/.test(d)) return "Escriba un número de Honduras de 8 dígitos, por ejemplo 9999-9999.";
        return "";
      },
      correo: function (v) {
        v = v.trim();
        if (!v) return "";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Revise el correo; parece incompleto.";
        return "";
      },
      mensaje: function (v) {
        v = v.trim();
        if (!v) return "Cuéntenos en una o dos líneas qué proceso le quita tiempo.";
        if (v.length < 10) return "Un poco más de detalle, por favor (mínimo 10 caracteres).";
        if (v.length > 1000) return "Máximo 1,000 caracteres.";
        if ((v.match(/https?:\/\//gi) || []).length > 2) return "Quite los enlaces del mensaje, por favor.";
        return "";
      }
    };
    var campos = {
      nombre: ["#f-nombre", "#e-nombre"],
      whatsapp: ["#f-whatsapp", "#e-whatsapp"],
      correo: ["#f-correo", "#e-correo"],
      mensaje: ["#f-mensaje", "#e-mensaje"]
    };
    var validar = function (k) {
      var i = $(campos[k][0]);
      return setErr(i, $(campos[k][1]), reglas[k](i.value));
    };
    Object.keys(campos).forEach(function (k) {
      $(campos[k][0]).addEventListener("blur", function () { validar(k); });
    });
    var consent = $("#f-consent"), eConsent = $("#e-consent"), status = $("#form-status");

    form.addEventListener("submit", function (e) {
      var ok = true, primero = null;
      Object.keys(campos).forEach(function (k) {
        if (!validar(k)) { ok = false; primero = primero || $(campos[k][0]); }
      });
      if (!setErr(consent, eConsent, consent.checked ? "" : "Necesitamos su autorización para responderle.")) {
        ok = false; primero = primero || consent;
      }
      // Antispam 1: campo trampa (honeypot). Netlify también lo descarta en el servidor.
      var trampa = form.querySelector('[name="bot-field"]');
      if (trampa && trampa.value) { e.preventDefault(); return; }
      // Antispam 2: una persona tarda más de 3 segundos en llenar el formulario.
      if (ok && Date.now() - cargado < 3000) {
        ok = false;
        status.className = "form-status err";
        status.textContent = "Fue muy rápido. Espere unos segundos y vuelva a enviar.";
      }
      if (!ok) {
        e.preventDefault();
        if (primero) primero.focus();
        if (!status.textContent) { status.className = "form-status err"; status.textContent = "Revise los campos marcados."; }
        return;
      }
      if (window.RD_CONFIG && window.RD_CONFIG.PREVIEW) {
        e.preventDefault();
        status.className = "form-status";
        status.textContent = "Vista previa: el formulario pasó la validación. El envío real funciona cuando el sitio está publicado en Netlify.";
        return;
      }
      status.className = "form-status";
      status.textContent = "Enviando…";
      track("generate_lead", { form: "contacto" });
    });
  }

  /* ---------- Consentimiento de cookies + Google Analytics 4 ---------- */
  var KEY = "rd_cookie_consent";
  var leer = function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  var guardar = function (v) { try { localStorage.setItem(KEY, v); } catch (e) { /* modo privado */ } };
  var gaId = (window.RD_CONFIG && window.RD_CONFIG.GA_MEASUREMENT_ID) || "";
  var gaListo = /^G-[A-Z0-9]{6,}$/.test(gaId) && gaId !== "G-XXXXXXXXXX";
  var gaCargado = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  // Consent Mode v2: todo negado por defecto hasta que la persona acepte.
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied"
  });

  function cargarGA() {
    if (!gaListo || gaCargado) return;
    gaCargado = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", gaId, { anonymize_ip: true });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(s);
  }
  function track(evento, params) { if (gaCargado) gtag("event", evento, params || {}); }

  var banner = $("#cookie-banner");
  var decision = leer();
  if (decision === "aceptar") cargarGA();
  if (banner) {
    if (!decision) banner.hidden = false;
    $$("[data-cookie]", banner).forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-cookie");
        guardar(v);
        banner.hidden = true;
        if (v === "aceptar") cargarGA();
        else if (gaCargado) { gtag("consent", "update", { analytics_storage: "denied" }); }
      });
    });
    $$("[data-cookie-settings]").forEach(function (b) {
      b.addEventListener("click", function () { banner.hidden = false; var f = $("button", banner); if (f) f.focus(); });
    });
  }

  /* Clic en WhatsApp como evento (solo si hay consentimiento) */
  $$('a[href^="https://wa.me/"]').forEach(function (a) {
    a.addEventListener("click", function () { track("contact_whatsapp", { link_url: a.href }); });
  });
})();
