const mongoose = require("mongoose");

const escrituraSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
  contenido: {
    type: String,
    required: true,
  },
});

const Escritura = mongoose.model("Escritura", escrituraSchema);

module.exports = Escritura;
