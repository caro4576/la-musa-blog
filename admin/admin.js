const listaObras = document.querySelector("#lista-obras");
const formObra = document.querySelector("#form-obra");

const formEditarObra = document.querySelector("#form-editar-obra");
const editarTitulo = document.querySelector("#editar-titulo");
const editarCategoria = document.querySelector("#editar-categoria");
const cancelarEdicion = document.querySelector("#cancelar-edicion");
const descripcion = document.querySelector("#descripcion");

let obraEditandoId = null;

function cargarObras() {

  listaObras.innerHTML = "";

  fetch("http://localhost:3000/api/obras")
    .then((response) => response.json())
    .then((obras) => {
      obras.forEach((obra) => {
        const elemento = document.createElement("div");
        elemento.textContent = `${obra.titulo} — ${obra.categoria} — ${obra.descripcion || "Sin descripción"}`;
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";

       botonEditar.addEventListener("click", () => {
         obraEditandoId = obra._id;

         editarTitulo.value = obra.titulo;
         editarCategoria.value = obra.categoria;


          formEditarObra.style.display = "block";
       });

        botonEliminar.addEventListener("click", () => {

          const confirmar = confirm(
            `¿Seguro que querés eliminar "${obra.titulo}"?`,
          );

          if (!confirmar) {
            return;
          }
          fetch(`http://localhost:3000/api/obras/${obra._id}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((resultado) => {
              console.log(resultado);

              cargarObras();
            })
            .catch((error) => {
              console.error("Error al eliminar la obra:", error);
            });
        });

        elemento.appendChild(botonEliminar);
        elemento.appendChild(botonEditar);

        listaObras.appendChild(elemento);
      });
    })
    .catch((error) => {
      console.error("Error al obtener las obras:", error);
    });
}
cargarObras();

formObra.addEventListener("submit", (event) => {
  event.preventDefault();

  const titulo = document.querySelector("#titulo").value;
  const categoria = document.querySelector("#categoria").value;
  const descripcion = document.querySelector("#descripcion").value;

  fetch("http://localhost:3000/api/obras", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      titulo: titulo,
      categoria: categoria,
      descripcion: descripcion,
    }),
  })
    .then((response) => response.json())
    .then((obra) => {
      console.log("Obra creada:", obra);

      cargarObras();
    })
    .catch((error) => {
      console.error("Error al crear la obra:", error);
    });
});
formEditarObra.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevoTitulo = editarTitulo.value;
  const nuevaCategoria = editarCategoria.value;

  fetch(`http://localhost:3000/api/obras/${obraEditandoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: nuevoTitulo,
      categoria: nuevaCategoria,
    }),
  })
    .then((response) => response.json())
    .then((resultado) => {
      console.log("Obra actualizada:", resultado);

      formEditarObra.reset();

      cargarObras();
    })
    .catch((error) => {
      console.error("Error al actualizar la obra:", error);
    });
});
cancelarEdicion.addEventListener("click", () => {
  formEditarObra.reset();

  obraEditandoId = null;

  formEditarObra.style.display = "none";
});