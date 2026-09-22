const mongoose = require("mongoose");

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  fecha: {
    type: String,
  },
  enlace: {
    type: String,
  },
});

const Libro = mongoose.model("Libro", libroSchema);

module.exports = Libro;
