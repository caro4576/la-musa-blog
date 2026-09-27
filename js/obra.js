const contenedorObras = document.querySelector("#obras-dinamicas");

const API_URL = "https://api.lamusaincarnata.com/api/obras";

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

  const imagen = obra.imagen
    ? `<img src="${escaparHTML(obra.imagen)}" alt="${escaparHTML(
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

      <p>
        Joaquín Vignatte
      </p>

      ${obra.descripcion ? `<p>${escaparHTML(obra.descripcion)}</p>` : ""}
    </div>
  `;

  return tarjeta;
}

async function cargarObrasPublicas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron obtener las obras.");
    }

    const obras = await response.json();

    contenedorObras.innerHTML = "";

    if (!obras.length) {
      contenedorObras.innerHTML =
        '<p class="archive__empty">Todavía no hay obras publicadas.</p>';
      return;
    }

    obras.forEach((obra, indice) => {
      contenedorObras.appendChild(crearTarjetaObra(obra, indice));
    });
  } catch (error) {
    console.error("Error al cargar las obras:", error);

    contenedorObras.innerHTML =
      '<p class="archive__empty">No se pudo cargar el archivo de obras.</p>';
  }
}

cargarObrasPublicas();
