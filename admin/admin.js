const listaObras = document.querySelector("#lista-obras");
const formObra = document.querySelector("#form-obra");

fetch("http://localhost:3000/api/obras")
  .then((response) => response.json())
  .then((obras) => {
    obras.forEach((obra) => {
      const elemento = document.createElement("p");

      elemento.textContent = `${obra.titulo} — ${obra.categoria}`;

      listaObras.appendChild(elemento);
    });
  })
  .catch((error) => {
    console.error("Error al obtener las obras:", error);
  });
  formObra.addEventListener("submit", (event) => {
    event.preventDefault();

    const titulo = document.querySelector("#titulo").value;
    const categoria = document.querySelector("#categoria").value;

    fetch("http://localhost:3000/api/obras", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        titulo: titulo,
        categoria: categoria,
      }),
    })
      .then((response) => response.json())
      .then((obra) => {
        console.log("Obra creada:", obra);
      })
      .catch((error) => {
        console.error("Error al crear la obra:", error);
      });
  });
