const libroFecha = document.querySelector("#libro-fecha");
const libroTitulo = document.querySelector("#libro-titulo");
const libroDescripcion = document.querySelector("#libro-descripcion");
const libroEnlace = document.querySelector("#libro-enlace");

const LIBROS_API_URL = "https://api.lamusaincarnata.com/api/libros";

function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function cargarLibro() {
  try {
    const response = await fetch(LIBROS_API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron obtener los libros.");
    }

    const libros = await response.json();

    if (!libros.length) {
      libroTitulo.textContent = "Todavía no hay libros publicados.";

      libroFecha.textContent = "";
      libroDescripcion.innerHTML = "";

      return;
    }

    // Tomamos el primer libro publicado

    const libro = libros[0];

    // FECHA

    libroFecha.textContent = `Lanzamiento · ${libro.fecha || ""}`;

    // TÍTULO

    libroTitulo.textContent = libro.titulo || "";

    // DESCRIPCIÓN

    if (libro.descripcion) {
      const parrafos = libro.descripcion.split("\n").filter(Boolean);

      libroDescripcion.innerHTML = parrafos
        .map((parrafo) => `<p>${escaparHTML(parrafo)}</p>`)
        .join("");
    } else {
      libroDescripcion.innerHTML = "";
    }

    // ENLACE AL PROYECTO

    if (libro.enlace) {
      libroEnlace.href = libro.enlace;
      libroEnlace.style.display = "inline-block";
    } else {
      libroEnlace.style.display = "none";
    }
  } catch (error) {
    console.error("Error al cargar el libro:", error);

    libroTitulo.textContent = "No se pudo cargar el libro.";

    libroFecha.textContent = "";

    libroDescripcion.innerHTML = "";
  }
}

cargarLibro();
