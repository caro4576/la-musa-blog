const mongoose = require("mongoose");
const Obra = require("./models/obra");
const express = require("express");

const app = express();
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

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
