const mongoose = require("mongoose");
const Obra = require("./models/obra");
const Escritura = require("./models/escritura");
const express = require("express");
const Libro = require("./models/libro");

const app = express();
app.use("/admin", express.static("../admin"));
app.use(express.json());

const PORT = 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/la_musa")
  .then(() => {
    console.log("MongoDB conectado correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Backend de La Musa funcionando");
});

app.get("/api/obras", async (req, res) => {
  try {
    const obras = await Obra.find();
    res.json(obras);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener las obras",
      error: error.message,
    });
  }
});
app.post("/api/obras", async (req, res) => {
  console.log("DATOS RECIBIDOS:", req.body);
  try {
    const nuevaObra = await Obra.create(req.body);

    res.status(201).json(nuevaObra);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear la obra",
      error: error.message,
    });
  }
});
app.put("/api/obras/:id", async (req, res) => {
  try {
    const obraActualizada = await Obra.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!obraActualizada) {
      return res.status(404).json({
        mensaje: "Obra no encontrada",
      });
    }

    res.json(obraActualizada);
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar la obra",
      error: error.message,
    });
  }
});
app.delete("/api/obras/:id", async (req, res) => {
  try {
    const obraEliminada = await Obra.findByIdAndDelete(req.params.id);

    if (!obraEliminada) {
      return res.status(404).json({
        mensaje: "Obra no encontrada",
      });
    }

    res.json({
      mensaje: "Obra eliminada correctamente",
      obra: obraEliminada,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al eliminar la obra",
      error: error.message,
    });
  }
});
// ===============================
// CRUD DE ESCRITURAS
// ===============================

// GET todas las escrituras
app.get("/api/escrituras", async (req, res) => {
    try {
        const escrituras = await Escritura.find();
        res.json(escrituras);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener las escrituras"
        });
    }
});

// GET una escritura por ID
app.get("/api/escrituras/:id", async (req, res) => {
    try {
        const escritura = await Escritura.findById(req.params.id);

        if (!escritura) {
            return res.status(404).json({
                error: "Escritura no encontrada"
            });
        }

        res.json(escritura);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener la escritura"
        });
    }
});

// POST crear escritura
app.post("/api/escrituras", async (req, res) => {
    try {
        const { titulo, categoria, contenido } = req.body;

        const nuevaEscritura = new Escritura({
            titulo,
            categoria,
            contenido
        });

        const escrituraGuardada = await nuevaEscritura.save();

        res.status(201).json(escrituraGuardada);
    } catch (error) {
        res.status(400).json({
            error: "Error al crear la escritura"
        });
    }
});

// PUT editar escritura
app.put("/api/escrituras/:id", async (req, res) => {
    try {
        const { titulo, categoria, contenido } = req.body;

        const escrituraActualizada = await Escritura.findByIdAndUpdate(
            req.params.id,
            {
                titulo,
                categoria,
                contenido
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!escrituraActualizada) {
            return res.status(404).json({
                error: "Escritura no encontrada"
            });
        }

        res.json(escrituraActualizada);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar la escritura"
        });
    }
});

// DELETE eliminar escritura
app.delete("/api/escrituras/:id", async (req, res) => {
    try {
        const escrituraEliminada = await Escritura.findByIdAndDelete(
            req.params.id
        );

        if (!escrituraEliminada) {
            return res.status(404).json({
                error: "Escritura no encontrada"
            });
        }

        res.json({
            mensaje: "Escritura eliminada correctamente",
            escritura: escrituraEliminada
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar la escritura"
        });
    }
});
// ===============================
// CRUD DE LIBROS
// ===============================

// GET todos los libros
app.get("/api/libros", async (req, res) => {
    try {
        const libros = await Libro.find();
        res.json(libros);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener los libros"
        });
    }
});

// GET un libro por ID
app.get("/api/libros/:id", async (req, res) => {
    try {
        const libro = await Libro.findById(req.params.id);

        if (!libro) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.json(libro);
    } catch (error) {
        res.status(500).json({
            error: "Error al obtener el libro"
        });
    }
});

// POST crear libro
app.post("/api/libros", async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            fecha,
            enlace
        } = req.body;

        const nuevoLibro = new Libro({
            titulo,
            descripcion,
            fecha,
            enlace
        });

        const libroGuardado = await nuevoLibro.save();

        res.status(201).json(libroGuardado);
    } catch (error) {
        res.status(400).json({
            error: "Error al crear el libro"
        });
    }
});

// PUT editar libro
app.put("/api/libros/:id", async (req, res) => {
    try {
        const {
            titulo,
            descripcion,
            fecha,
            enlace
        } = req.body;

        const libroActualizado = await Libro.findByIdAndUpdate(
            req.params.id,
            {
                titulo,
                descripcion,
                fecha,
                enlace
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!libroActualizado) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.json(libroActualizado);
    } catch (error) {
        res.status(400).json({
            error: "Error al actualizar el libro"
        });
    }
});

// DELETE eliminar libro
app.delete("/api/libros/:id", async (req, res) => {
    try {
        const libroEliminado = await Libro.findByIdAndDelete(
            req.params.id
        );

        if (!libroEliminado) {
            return res.status(404).json({
                error: "Libro no encontrado"
            });
        }

        res.json({
            mensaje: "Libro eliminado correctamente",
            libro: libroEliminado
        });
    } catch (error) {
        res.status(500).json({
            error: "Error al eliminar el libro"
        });
    }
});
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
