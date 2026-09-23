const mongoose = require("mongoose");
const Obra = require("./models/obra");
const Escritura = require("./models/escritura");
const express = require("express");
const Libro = require("./models/libro");
const path = require("path");
const crypto = require("crypto");

const app = express();

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_AUTH_SECRET = process.env.ADMIN_AUTH_SECRET;
const ADMIN_SESSION_MS = 8 * 60 * 60 * 1000;

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function crearTokenAdmin(usuario) {
  const payload = {
    sub: usuario,
    exp: Date.now() + ADMIN_SESSION_MS,
  };

  const datos = base64url(JSON.stringify(payload));
  const firma = crypto
    .createHmac("sha256", ADMIN_AUTH_SECRET)
    .update(datos)
    .digest("base64url");

  return `${datos}.${firma}`;
}

function obtenerCookie(req, nombre) {
  const cookies = req.headers.cookie || "";

  for (const parte of cookies.split(";")) {
    const [clave, ...valor] = parte.trim().split("=");

    if (clave === nombre) {
      return decodeURIComponent(valor.join("="));
    }
  }

  return null;
}

function tokenAdminValido(token) {
  if (!token || !ADMIN_AUTH_SECRET) return false;

  const partes = token.split(".");
  if (partes.length !== 2) return false;

  const [datos, firma] = partes;
  const firmaEsperada = crypto
    .createHmac("sha256", ADMIN_AUTH_SECRET)
    .update(datos)
    .digest("base64url");

  if (firma.length !== firmaEsperada.length) return false;

  const coincide = crypto.timingSafeEqual(
    Buffer.from(firma),
    Buffer.from(firmaEsperada),
  );

  if (!coincide) return false;

  try {
    const payload = JSON.parse(Buffer.from(datos, "base64url").toString("utf8"));
    return payload.exp > Date.now() && payload.sub === ADMIN_USER;
  } catch {
    return false;
  }
}

function adminAutenticado(req) {
  return tokenAdminValido(obtenerCookie(req, "__Host-LaMusaAdmin"));
}

function requireAdmin(req, res, next) {
  if (!adminAutenticado(req)) {
    if (req.path.startsWith("/admin")) {
      return res.redirect("/admin/login.html");
    }

    return res.status(401).json({ error: "No autorizado" });
  }

  next();
}

app.use((req, res, next) => {
  const origenesPermitidos = [
    "http://localhost:3000",
    "https://lamusaincarnata.com",
    "https://www.lamusaincarnata.com",
  ];

  const origen = req.headers.origin;

  if (origenesPermitidos.includes(origen)) {
    res.header("Access-Control-Allow-Origin", origen);
  }

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const adminPath = path.join(__dirname, "admin");

app.use(express.json());

app.get("/admin/login.html", (req, res) => {
  res.sendFile(path.join(adminPath, "login.html"));
});

app.get("/admin/login.js", (req, res) => {
  res.sendFile(path.join(adminPath, "login.js"));
});

app.post("/api/login", (req, res) => {
  if (!ADMIN_USER || !ADMIN_PASSWORD || !ADMIN_AUTH_SECRET) {
    return res.status(500).json({
      error: "El acceso del administrador no está configurado en el servidor.",
    });
  }

  const { usuario, password } = req.body;

  const usuarioCorrecto =
    typeof usuario === "string" &&
    usuario === ADMIN_USER;

  const passwordCorrecta =
    typeof password === "string" &&
    password === ADMIN_PASSWORD;

  if (!usuarioCorrecto || !passwordCorrecta) {
    return res.status(401).json({
      error: "Usuario o contraseña incorrectos.",
    });
  }

  const token = crearTokenAdmin(usuario);

  res
    .cookie("__Host-LaMusaAdmin", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: ADMIN_SESSION_MS,
    })
    .json({ ok: true });
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("__Host-LaMusaAdmin", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  res.json({ ok: true });
});

app.get("/admin", requireAdmin, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

app.get("/admin/", requireAdmin, (req, res) => {
  res.sendFile(path.join(adminPath, "index.html"));
});

app.use("/admin", requireAdmin, express.static(adminPath, { index: false }));

const PORT = process.env.PORT || 3000;
mongoose;
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/la_musa")
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
app.post("/api/obras", requireAdmin, async (req, res) => {
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
app.put("/api/obras/:id", requireAdmin, async (req, res) => {
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
app.delete("/api/obras/:id", requireAdmin, async (req, res) => {
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
      error: "Error al obtener las escrituras",
    });
  }
});

// GET una escritura por ID
app.get("/api/escrituras/:id", async (req, res) => {
  try {
    const escritura = await Escritura.findById(req.params.id);

    if (!escritura) {
      return res.status(404).json({
        error: "Escritura no encontrada",
      });
    }

    res.json(escritura);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener la escritura",
    });
  }
});

// POST crear escritura
app.post("/api/escrituras", requireAdmin, async (req, res) => {
  try {
    const { titulo, categoria, contenido } = req.body;

    const nuevaEscritura = new Escritura({
      titulo,
      categoria,
      contenido,
    });

    const escrituraGuardada = await nuevaEscritura.save();

    res.status(201).json(escrituraGuardada);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear la escritura",
    });
  }
});

// PUT editar escritura
app.put("/api/escrituras/:id", requireAdmin, async (req, res) => {
  try {
    const { titulo, categoria, contenido } = req.body;

    const escrituraActualizada = await Escritura.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        categoria,
        contenido,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!escrituraActualizada) {
      return res.status(404).json({
        error: "Escritura no encontrada",
      });
    }

    res.json(escrituraActualizada);
  } catch (error) {
    res.status(400).json({
      error: "Error al actualizar la escritura",
    });
  }
});

// DELETE eliminar escritura
app.delete("/api/escrituras/:id", requireAdmin, async (req, res) => {
  try {
    const escrituraEliminada = await Escritura.findByIdAndDelete(req.params.id);

    if (!escrituraEliminada) {
      return res.status(404).json({
        error: "Escritura no encontrada",
      });
    }

    res.json({
      mensaje: "Escritura eliminada correctamente",
      escritura: escrituraEliminada,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar la escritura",
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
      error: "Error al obtener los libros",
    });
  }
});

// GET un libro por ID
app.get("/api/libros/:id", async (req, res) => {
  try {
    const libro = await Libro.findById(req.params.id);

    if (!libro) {
      return res.status(404).json({
        error: "Libro no encontrado",
      });
    }

    res.json(libro);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener el libro",
    });
  }
});

// POST crear libro
app.post("/api/libros", requireAdmin, async (req, res) => {
  try {
    const { titulo, descripcion, fecha, enlace } = req.body;

    const nuevoLibro = new Libro({
      titulo,
      descripcion,
      fecha,
      enlace,
    });

    const libroGuardado = await nuevoLibro.save();

    res.status(201).json(libroGuardado);
  } catch (error) {
    res.status(400).json({
      error: "Error al crear el libro",
    });
  }
});

// PUT editar libro
app.put("/api/libros/:id", requireAdmin, async (req, res) => {
  try {
    const { titulo, descripcion, fecha, enlace } = req.body;

    const libroActualizado = await Libro.findByIdAndUpdate(
      req.params.id,
      {
        titulo,
        descripcion,
        fecha,
        enlace,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!libroActualizado) {
      return res.status(404).json({
        error: "Libro no encontrado",
      });
    }

    res.json(libroActualizado);
  } catch (error) {
    res.status(400).json({
      error: "Error al actualizar el libro",
    });
  }
});

// DELETE eliminar libro
app.delete("/api/libros/:id", requireAdmin, async (req, res) => {
  try {
    const libroEliminado = await Libro.findByIdAndDelete(req.params.id);

    if (!libroEliminado) {
      return res.status(404).json({
        error: "Libro no encontrado",
      });
    }

    res.json({
      mensaje: "Libro eliminado correctamente",
      libro: libroEliminado,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al eliminar el libro",
    });
  }
});
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
