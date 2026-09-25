const contenedorEscrituras = document.querySelector("#escrituras-dinamicas");

const API_URL = "https://api.lamusaincarnata.com/api/escrituras";

function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearEscritura(escritura, indice) {
  const articulo = document.createElement("article");

  articulo.className = "writing__featured";

  articulo.innerHTML = `
        <div class="writing__meta">
            <span>${escaparHTML(escritura.categoria)}</span>
            <span>${String(indice + 1).padStart(2, "0")}</span>
        </div>

        <h3>
            ${escaparHTML(escritura.titulo)}
        </h3>

        <p class="writing__excerpt">
            ${escaparHTML(escritura.contenido)}
        </p>
    `;

  return articulo;
}

async function cargarEscriturasPublicas() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudieron obtener las escrituras.");
    }

    const escrituras = await response.json();

    contenedorEscrituras.innerHTML = "";

    if (!escrituras.length) {
      contenedorEscrituras.innerHTML = `
                <p class="archive__empty">
                    Todavía no hay escrituras publicadas.
                </p>
            `;

      return;
    }

    escrituras.forEach((escritura, indice) => {
      contenedorEscrituras.appendChild(crearEscritura(escritura, indice));
    });
  } catch (error) {
    console.error("Error al cargar las escrituras:", error);

    contenedorEscrituras.innerHTML = `
            <p class="archive__empty">
                No se pudieron cargar las escrituras.
            </p>
        `;
  }
}

cargarEscriturasPublicas();
