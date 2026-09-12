const mongoose = require("mongoose");
const express = require("express");

const app = express();

const PORT = 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/la_musa")
  .then(() => {
    console.log("MongoDB conectado correctamente");
  })
  .catch((error) => {
    console.error("Error al conectar con MongoDB:", error);
  });

const obras = [
  {
    id: 1,
    titulo: "La criatura",
    categoria: "Ilustración",
  },
  {
    id: 2,
    titulo: "Personaje alado",
    categoria: "Personaje",
  },
];

app.get("/", (req, res) => {
  res.send("Backend de La Musa funcionando");
});
app.get("/api/obras", (req, res) => {
  res.json(obras);
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
