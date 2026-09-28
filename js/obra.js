const contenedorObras = document.querySelector("#obras-dinamicas");

const API_URL = "https://api.lamusaincarnata.com/api/obras";

// Respaldo de las obras originales del sitio.
const OBRAS_RESPALDO = [
  {
    _id: "la-criatura",
    titulo: "La criatura",
    categoria: "Ilustración",
    descripcion: "",
    imagen: "assets/img/01-La criatura.png",
  },
  {
    _id: "personaje",
    titulo: "Personaje alado",
    categoria: "Personaje",
    descripcion: "",
    imagen: "assets/img/02-Personaje.png",
  },
  {
    _id: "alienigena",
    titulo: "Alienígena",
    categoria: "Personaje",
    descripcion: "",
    imagen: "assets/img/02-Personaje(2).png",
  },
  {
    _id: "diseno-de-personaje",
    titulo: "Diseño de personaje",
    categoria: "Diseño de personaje",
    descripcion: "",
    imagen: "assets/img/el.png",
  },
];

function escaparHTML(valor = "") {
  return String(valor)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function crearTarjetaObra(obra, indice, esRespaldo = false) {
  const tarjeta = document.createElement("a");
  tarjeta.className = "archive__item";

  if (esRespaldo) {
    const destinos = {
      "la-criatura": "la-criatura.html",
      personaje: "personaje.html",
      alienigena: "vigna.html",
      "diseno-de-personaje": "diseno-de-personaje.html",
    };

    tarjeta.href = destinos[obra._id] || "obra.html";
  } else {
    tarjeta.href = `obra-detalle.html?id=${encodeURIComponent(obra._id)}`;
  }

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

function normalizarTitulo(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function combinarObras(obrasAPI) {
  const resultado = [...OBRAS_RESPALDO];
  const titulos = new Set(
    resultado.map((obra) => normalizarTitulo(obra.titulo)),
  );

  for (const obra of obrasAPI) {
    const titulo = normalizarTitulo(obra.titulo);

    if (!titulo || titulos.has(titulo)) continue;

    resultado.push(obra);
    titulos.add(titulo);
  }

  return resultado;
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

    mostrarObras(combinarObras(obras));
  } catch (error) {
    console.error("Error al cargar las obras:", error);
    mostrarObras(OBRAS_RESPALDO, true);
  }
}

cargarObrasPublicas();
