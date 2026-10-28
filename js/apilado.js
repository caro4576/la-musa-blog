// ==========================================
// SECCIONES APILADAS + MENÚ FIJO
// - Ajusta el "top" de las secciones altas
// - Maneja los links del menú (#obra, #libros, etc.)
// - Marca en el menú la sección que se está viendo
// - Hace transparente el menú arriba de todo
// Para sacar el efecto: borrar este archivo y su <script>.
// ==========================================

(function () {
  const main = document.querySelector("main");
  if (!main) return;

  const header = document.querySelector(".header");

  const secciones = Array.from(main.children).filter((el) =>
    el.matches(
      ".hero, .section--obra, .section--writing, .section--books, .section--about, .section--commissions",
    ),
  );

  if (!secciones.length) return;

  const linksMenu = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

  function alturaHeader() {
    return header ? header.offsetHeight : 0;
  }

  // Si una sección es más alta que la pantalla, se pega por su parte de abajo
  // (así se puede leer completa antes de que la tape la siguiente).
  function ajustarTops() {
    const alto = window.innerHeight;

    secciones.forEach((seccion) => {
      const top = Math.floor(Math.min(0, alto - seccion.offsetHeight));
      seccion.style.top = top + "px";
    });
  }

  // Posición "natural" de una sección (sin contar que esté pegada)
  function posicionNatural(seccion) {
    let y = main.getBoundingClientRect().top + window.scrollY;

    for (const hijo of main.children) {
      if (hijo === seccion) break;
      y += hijo.offsetHeight;
    }

    return y;
  }

  // Menú transparente arriba de todo + link de la sección actual
  function actualizarMenu() {
    const y = window.scrollY;

    if (header) {
      header.classList.toggle("header--transparente", y < 40);
    }

    const referencia = y + alturaHeader() + 8;
    let actual = null;

    secciones.forEach((seccion) => {
      if (seccion.id && posicionNatural(seccion) <= referencia) {
        actual = seccion.id;
      }
    });

    linksMenu.forEach((link) => {
      const activo = link.getAttribute("href") === "#" + actual;
      link.classList.toggle("is-active", activo);

      if (activo) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // Los links internos no funcionan solos con secciones pegadas
  // (el navegador cree que ya estás en ellas), así que los manejamos acá.
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    const destino = id ? document.getElementById(id) : null;

    if (!destino || !secciones.includes(destino)) return;

    e.preventDefault();

    window.scrollTo({
      top: Math.max(0, posicionNatural(destino) - alturaHeader()),
      behavior: "smooth",
    });
    history.replaceState(null, "", "#" + id);

    // Cerrar el menú del celular si estaba abierto
    const nav = document.querySelector(".nav");
    const boton = document.querySelector(".nav__button");

    if (nav && boton && nav.classList.contains("active")) {
      nav.classList.remove("active");
      boton.setAttribute("aria-expanded", "false");
      boton.textContent = "☰";
    }
  });

  // Throttle del scroll
  let pendiente = false;

  window.addEventListener(
    "scroll",
    () => {
      if (pendiente) return;
      pendiente = true;

      requestAnimationFrame(() => {
        pendiente = false;
        actualizarMenu();
      });
    },
    { passive: true },
  );

  function recalcular() {
    ajustarTops();
    actualizarMenu();
  }

  window.addEventListener("resize", recalcular);

  window.addEventListener("load", () => {
    recalcular();

    // Si entraron con un link tipo index.html#libros, que el menú fijo no tape el título
    const id = location.hash.slice(1);
    const destino = id ? document.getElementById(id) : null;

    if (destino && secciones.includes(destino)) {
      window.scrollTo({
        top: Math.max(0, posicionNatural(destino) - alturaHeader()),
        behavior: "instant",
      });
      actualizarMenu();
    }
  });

  // Las obras se cargan después: recalcular cuando cambie la altura
  if ("ResizeObserver" in window) {
    const observador = new ResizeObserver(recalcular);
    secciones.forEach((seccion) => observador.observe(seccion));
  }

  recalcular();
})();
