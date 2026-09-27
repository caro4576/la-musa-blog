const API_PERFIL = "https://api.lamusaincarnata.com/api/perfil";

const perfilEyebrow = document.querySelector("#perfil-eyebrow");
const perfilTitulo = document.querySelector("#perfil-titulo");
const perfilStatement = document.querySelector("#perfil-statement");
const perfilTexto1 = document.querySelector("#perfil-texto-1");
const perfilTexto2 = document.querySelector("#perfil-texto-2");
const perfilTexto3 = document.querySelector("#perfil-texto-3");

async function cargarPerfil() {
  try {
    const response = await fetch(API_PERFIL);
    if (!response.ok) throw new Error("No se pudo cargar el perfil.");

    const perfil = await response.json();

    if (perfil.eyebrow) perfilEyebrow.textContent = perfil.eyebrow;
    if (perfil.titulo) perfilTitulo.textContent = perfil.titulo;
    if (perfil.statement) perfilStatement.innerHTML = perfil.statement.replace(/\n/g, "<br>");
    if (perfil.texto1) perfilTexto1.textContent = perfil.texto1;
    if (perfil.texto2) perfilTexto2.textContent = perfil.texto2;
    if (perfil.texto3) perfilTexto3.textContent = perfil.texto3;
  } catch (error) {
    console.error("Error al cargar el perfil:", error);
  }
}

cargarPerfil();
