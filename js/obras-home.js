const contenedorObrasHome = document.querySelector("#obras-home-dinamicas");
const API_OBRAS_HOME = "https://api.lamusaincarnata.com/api/obras";

function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearTarjetaObraHome(obra) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "obra__card";
  tarjeta.href = `obra-detalle.html?id=${encodeURIComponent(obra._id)}`;

  const imagen = obra.imagen
    ? `<img src="${escaparHTML(obra.imagen)}" alt="${escaparHTML(obra.titulo)}, obra de Joaquín Vignatte">`
    : `<div class="obra__card-image">IMAGEN PENDIENTE</div>`;

  tarjeta.innerHTML = `
    <div class="obra__card-image">
      ${imagen}
    </div>
    <div class="obra__card-info">
      <span class="obra__category">${escaparHTML(obra.categoria)}</span>
      <h3>${escaparHTML(obra.titulo)}</h3>
    </div>
  `;

  return tarjeta;
}

async function cargarObrasHome() {
  if (!contenedorObrasHome) return;

  try {
    const response = await fetch(API_OBRAS_HOME);
    if (!response.ok) throw new Error("No se pudieron cargar las obras.");

    const obras = await response.json();
    if (!Array.isArray(obras) || !obras.length) return;

    contenedorObrasHome.innerHTML = "";
    obras.forEach((obra) => {
      contenedorObrasHome.appendChild(crearTarjetaObraHome(obra));
    });
  } catch (error) {
    // Si la API falla, dejamos intactas las tarjetas estáticas originales.
    console.error("Error al cargar las obras del inicio:", error);
  }
}

cargarObrasHome();
