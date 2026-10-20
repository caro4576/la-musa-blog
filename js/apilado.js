// ==========================================
// SECCIONES APILADAS
// Ajusta el "top" de cada sección según su altura y
// arregla los links del menú (#obra, #libros, etc.)
// Para sacar el efecto: borrar este archivo y su <script>.
// ==========================================

(function () {
  const main = document.querySelector("main");
  if (!main) return;

  const secciones = Array.from(main.children).filter((el) =>
    el.matches(
      ".hero, .section--obra, .section--writing, .section--books, .section--about, .section--commissions",
    ),
  );

  if (!secciones.length) return;

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

  // Los links internos no funcionan solos con secciones pegadas
  // (el navegador cree que ya estás en ellas), así que los manejamos acá.
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    const destino = id ? document.getElementById(id) : null;

    if (!destino || !secciones.includes(destino)) return;

    e.preventDefault();

    window.scrollTo({ top: posicionNatural(destino), behavior: "smooth" });
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

  ajustarTops();
  window.addEventListener("resize", ajustarTops);
  window.addEventListener("load", ajustarTops);

  // Las obras se cargan después: recalcular cuando cambie la altura
  if ("ResizeObserver" in window) {
    const observador = new ResizeObserver(ajustarTops);
    secciones.forEach((seccion) => observador.observe(seccion));
  }
})();
