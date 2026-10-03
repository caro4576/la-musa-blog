const contenedorObras = document.querySelector("#obras-dinamicas");

const API_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/obras"
    : "https://api.lamusaincarnata.com/api/obras";

function obtenerUrlImagen(id) {
  return API_URL + "/" + encodeURIComponent(id) + "/imagen";
}


function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearTarjetaObra(obra, indice) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "archive__item";

  tarjeta.href = `obra-detalle.html?id=${encodeURIComponent(obra._id)}`;

  const imagen = obra._id
    ? `<img src="${obtenerUrlImagen(obra._id)}" alt="${escaparHTML(
        obra.titulo,
      )}, obra de Joaquín Vignatte">`
    : `<div class="archive__placeholder">IMAGEN PENDIENTE</div>`;

  tarjeta.innerHTML = `
    <div class="archive__image">
      ${imagen}
    </div>

    <div class="archive__info">
      <span>
        ${String(indice + 1).padStart(2, "0")} · ${escaparHTML(
    obra.categoria,
  )}
      </span>

      <h2>${escaparHTML(obra.titulo)}</h2>

      <p>Joaquín Vignatte</p>

      ${obra.descripcion ? `<p>${escaparHTML(obra.descripcion)}</p>` : ""}
    </div>
  `;

  return tarjeta;
}

function mostrarObras(obras, esRespaldo = false) {
  contenedorObras.innerHTML = "";

  obras.forEach((obra, indice) => {
    contenedorObras.appendChild(
      crearTarjetaObra(obra, indice, esRespaldo),
    );
  });
}



async function cargarObrasPublicas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron obtener las obras.");
    }

    const obras = await response.json();

    if (!Array.isArray(obras)) {
      throw new Error("La respuesta de obras no es válida.");
    }

    const obrasUnicas = Array.from(
      new Map(obras.map((obra) => [String(obra._id), obra])).values(),
    );

    mostrarObras(obrasUnicas);
  } catch (error) {
    console.error("Error al cargar las obras:", error);
    mostrarObras([]);
  }
}

cargarObrasPublicas();
