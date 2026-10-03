const API_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/obras"
    : "https://api.lamusaincarnata.com/api/obras";

function obtenerUrlImagen(id) {
  return API_URL + "/" + encodeURIComponent(id) + "/imagen";
}


const titulo = document.querySelector("#obra-titulo");
const categoria = document.querySelector("#obra-categoria");
const imagen = document.querySelector("#obra-imagen");
const placeholder = document.querySelector("#obra-placeholder");
const descripcion = document.querySelector("#obra-descripcion");
const numero = document.querySelector("#obra-numero");
const subtitulo = document.querySelector("#obra-subtitulo");

function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function cargarObra() {
  const parametros = new URLSearchParams(window.location.search);
  const id = parametros.get("id");

  if (!id) {
    mostrarError("No se indicó qué obra mostrar.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`);

    if (!response.ok) {
      throw new Error("No se pudo obtener la obra.");
    }

    const obra = await response.json();

    document.title = `${obra.titulo} — La Musa Incarnata`;

    titulo.textContent = obra.titulo || "Sin título";
    categoria.textContent = `Obra · ${obra.categoria || "Sin categoría"}`;

    const indice =
      Number.isFinite(obra._numero) ? obra._numero : null;

    numero.textContent = "Obra · Archivo";

    subtitulo.textContent =
      obra.descripcion
        ? "Una pieza del archivo de La Musa Incarnata."
        : "Una nueva pieza del archivo.";

    if (obra.descripcion) {
      const parrafos = obra.descripcion
        .split("\n")
        .map((parrafo) => parrafo.trim())
        .filter(Boolean);

      descripcion.innerHTML = parrafos
        .map((parrafo) => `<p>${escaparHTML(parrafo)}</p>`)
        .join("");
    } else {
      descripcion.innerHTML =
        "<p>Esta obra forma parte del archivo visual de La Musa Incarnata.</p>";
    }

    if (obra._id) {
      imagen.src = obtenerUrlImagen(obra._id);
      imagen.alt = `${obra.titulo}, obra de Joaquín Vignatte`;
      imagen.style.display = "block";
      placeholder.style.display = "none";
    } else {
      imagen.style.display = "none";
      placeholder.textContent = "IMAGEN PENDIENTE";
      placeholder.style.display = "flex";
    }
  } catch (error) {
    console.error("Error al cargar la obra:", error);
    mostrarError("No se pudo cargar la obra.");
  }
}

function mostrarError(mensaje) {
  titulo.textContent = mensaje;
  categoria.textContent = "";
  numero.textContent = "";
  subtitulo.textContent = "";
  descripcion.innerHTML = "";
  imagen.style.display = "none";
  placeholder.textContent = "";
  placeholder.style.display = "none";
}

cargarObra();
