const listaObras = document.querySelector("#lista-obras");
const formObra = document.querySelector("#form-obra");

const formEditarObra = document.querySelector("#form-editar-obra");
const editarTitulo = document.querySelector("#editar-titulo");
const editarCategoria = document.querySelector("#editar-categoria");
const cancelarEdicion = document.querySelector("#cancelar-edicion");
const descripcion = document.querySelector("#descripcion");
const editarDescripcion = document.querySelector("#editar-descripcion");
const listaEscrituras = document.querySelector("#lista-escrituras");
const formEscritura = document.querySelector("#form-escritura");

let obraEditandoId = null;

// ===============================
// ADMIN DE OBRAS
// ===============================

function cargarObras() {
  listaObras.innerHTML = "";

  fetch("https://api.lamusaincarnata.com/api/obras")
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
          editarDescripcion.value = obra.descripcion || "";

          formEditarObra.style.display = "block";
        });

        botonEliminar.addEventListener("click", () => {
          const confirmar = confirm(
            `¿Seguro que querés eliminar "${obra.titulo}"?`,
          );

          if (!confirmar) {
            return;
          }
          fetch(`https://api.lamusaincarnata.com/api/obras/${obra._id}`, {
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

  fetch("https://api.lamusaincarnata.com/api/obras", {
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
  const nuevaDescripcion = editarDescripcion.value;

  fetch(`https://api.lamusaincarnata.com/api/obras/${obraEditandoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo: nuevoTitulo,
      categoria: nuevaCategoria,
      descripcion: nuevaDescripcion,
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
// ===============================
// ADMIN DE ESCRITURAS
// ===============================

function cargarEscrituras() {
  listaEscrituras.innerHTML = "";

  fetch("https://api.lamusaincarnata.com/api/escrituras")
    .then((response) => response.json())
    .then((escrituras) => {
      escrituras.forEach((escritura) => {
        const elemento = document.createElement("div");

        elemento.textContent = `${escritura.titulo} — ${escritura.categoria} — ${escritura.contenido}`;

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", () => {
          prepararEdicionEscritura(escritura);
        });

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
          const confirmar = confirm(
            `¿Seguro que querés eliminar "${escritura.titulo}"?`,
          );

          if (!confirmar) {
            return;
          }

          fetch(
            `https://api.lamusaincarnata.com/api/escrituras/${escritura._id}`,
            {
              method: "DELETE",
            },
          )
            .then((response) => response.json())
            .then((resultado) => {
              console.log(resultado);
              cargarEscrituras();
            })
            .catch((error) => {
              console.error("Error al eliminar la escritura:", error);
            });
        });

        elemento.appendChild(botonEditar);
        elemento.appendChild(botonEliminar);
        listaEscrituras.appendChild(elemento);
      });
    })
    .catch((error) => {
      console.error("Error al obtener las escrituras:", error);
    });
}

cargarEscrituras();

formEscritura.addEventListener("submit", (event) => {
  event.preventDefault();

  const titulo = document.querySelector("#escritura-titulo").value;
  const categoria = document.querySelector("#escritura-categoria").value;
  const contenido = document.querySelector("#escritura-contenido").value;
  console.log("Contenido:", contenido);

  fetch("https://api.lamusaincarnata.com/api/escrituras", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      titulo,
      categoria,
      contenido,
    }),
  })
    .then((response) => response.json())
    .then((escritura) => {
      console.log("Escritura creada:", escritura);

      formEscritura.reset();

      cargarEscrituras();
    })
    .catch((error) => {
      console.error("Error al crear la escritura:", error);
    });
});
// ===============================
// EDITAR ESCRITURAS
// ===============================

const formEditarEscritura = document.querySelector("#form-editar-escritura");
const editarEscrituraTitulo = document.querySelector(
  "#editar-escritura-titulo",
);
const editarEscrituraCategoria = document.querySelector(
  "#editar-escritura-categoria",
);
const editarEscrituraContenido = document.querySelector(
  "#editar-escritura-contenido",
);
const cancelarEdicionEscritura = document.querySelector(
  "#cancelar-edicion-escritura",
);

let escrituraEditandoId = null;

// ===============================
// BOTÓN EDITAR
// ===============================

function prepararEdicionEscritura(escritura) {
  escrituraEditandoId = escritura._id;

  editarEscrituraTitulo.value = escritura.titulo;
  editarEscrituraCategoria.value = escritura.categoria;
  editarEscrituraContenido.value = escritura.contenido;

  formEditarEscritura.style.display = "block";
}
// ===============================
// GUARDAR CAMBIOS DE ESCRITURA
// ===============================

formEditarEscritura.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevoTitulo = editarEscrituraTitulo.value;
  const nuevaCategoria = editarEscrituraCategoria.value;
  const nuevoContenido = editarEscrituraContenido.value;

  fetch(
    `https://api.lamusaincarnata.com/api/escrituras/${escrituraEditandoId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        titulo: nuevoTitulo,
        categoria: nuevaCategoria,
        contenido: nuevoContenido,
      }),
    },
  )
    .then((response) => response.json())
    .then((resultado) => {
      console.log("Escritura actualizada:", resultado);

      formEditarEscritura.reset();

      escrituraEditandoId = null;

      formEditarEscritura.style.display = "none";

      cargarEscrituras();
    })
    .catch((error) => {
      console.error("Error al actualizar la escritura:", error);
    });
});

// ===============================
// CANCELAR EDICIÓN DE ESCRITURA
// ===============================

cancelarEdicionEscritura.addEventListener("click", () => {
  formEditarEscritura.reset();

  escrituraEditandoId = null;

  formEditarEscritura.style.display = "none";
});

// ===============================
// ADMIN DE LIBROS
// ===============================

const listaLibros = document.querySelector("#lista-libros");
const formLibro = document.querySelector("#form-libro");

const formEditarLibro = document.querySelector("#form-editar-libro");
const editarLibroTitulo = document.querySelector("#editar-libro-titulo");
const editarLibroDescripcion = document.querySelector(
  "#editar-libro-descripcion",
);
const editarLibroFecha = document.querySelector("#editar-libro-fecha");
const editarLibroEnlace = document.querySelector("#editar-libro-enlace");

let libroEditandoId = null;

// ===============================
// CARGAR LIBROS
// ===============================

function cargarLibros() {
  listaLibros.innerHTML = "";

  fetch("https://api.lamusaincarnata.com/api/libros")
    .then((response) => response.json())
    .then((libros) => {
      libros.forEach((libro) => {
        const elemento = document.createElement("div");

        elemento.textContent = `${libro.titulo} — ${libro.fecha || "Sin fecha"} — ${libro.descripcion || "Sin descripción"} — ${libro.enlace || "Sin enlace"}`;

        // BOTÓN EDITAR

        const botonEditar = document.createElement("button");

        botonEditar.textContent = "Editar";

        botonEditar.addEventListener("click", () => {
          libroEditandoId = libro._id;

          editarLibroTitulo.value = libro.titulo;
          editarLibroDescripcion.value = libro.descripcion || "";
          editarLibroFecha.value = libro.fecha || "";
          editarLibroEnlace.value = libro.enlace || "";

          formEditarLibro.style.display = "block";
        });

        // BOTÓN ELIMINAR

        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";

        botonEliminar.addEventListener("click", () => {
          const confirmar = confirm(
            `¿Seguro que querés eliminar "${libro.titulo}"?`,
          );

          if (!confirmar) {
            return;
          }

          fetch(`https://api.lamusaincarnata.com/api/libros/${libro._id}`, {
            method: "DELETE",
          })
            .then((response) => response.json())
            .then((resultado) => {
              console.log(resultado);

              cargarLibros();
            })
            .catch((error) => {
              console.error("Error al eliminar el libro:", error);
            });
        });

        elemento.appendChild(botonEditar);
        elemento.appendChild(botonEliminar);

        listaLibros.appendChild(elemento);
      });
    })
    .catch((error) => {
      console.error("Error al obtener los libros:", error);
    });
}

// ===============================
// CREAR LIBRO
// ===============================

formLibro.addEventListener("submit", (event) => {
  event.preventDefault();

  const titulo = document.querySelector("#libro-titulo").value;

  const descripcion = document.querySelector("#libro-descripcion").value;

  const fecha = document.querySelector("#libro-fecha").value;

  const enlace = document.querySelector("#libro-enlace").value;

  fetch("https://api.lamusaincarnata.com/api/libros", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      titulo,
      descripcion,
      fecha,
      enlace,
    }),
  })
    .then((response) => response.json())
    .then((libro) => {
      console.log("Libro creado:", libro);

      formLibro.reset();

      cargarLibros();
    })
    .catch((error) => {
      console.error("Error al crear el libro:", error);
    });
});

// ===============================
// EDITAR LIBRO
// ===============================

formEditarLibro.addEventListener("submit", (event) => {
  event.preventDefault();

  const nuevoTitulo = editarLibroTitulo.value;
  const nuevaDescripcion = editarLibroDescripcion.value;
  const nuevaFecha = editarLibroFecha.value;
  const nuevoEnlace = editarLibroEnlace.value;

  fetch(`https://api.lamusaincarnata.com/api/libros/${libroEditandoId}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      titulo: nuevoTitulo,
      descripcion: nuevaDescripcion,
      fecha: nuevaFecha,
      enlace: nuevoEnlace,
    }),
  })
    .then((response) => response.json())
    .then((resultado) => {
      console.log("Libro actualizado:", resultado);

      formEditarLibro.reset();

      libroEditandoId = null;

      formEditarLibro.style.display = "none";

      cargarLibros();
    })
    .catch((error) => {
      console.error("Error al actualizar el libro:", error);
    });
});

// ===============================
// CANCELAR EDICIÓN
// ===============================

const cancelarEdicionLibro = document.querySelector("#cancelar-edicion-libro");
console.log("BOTÓN CANCELAR LIBRO:", cancelarEdicionLibro);
cancelarEdicionLibro.addEventListener("click", () => {
  formEditarLibro.reset();
  libroEditandoId = null;
  formEditarLibro.style.display = "none";
});
// ===============================
// INICIAR
// ===============================

cargarLibros();
