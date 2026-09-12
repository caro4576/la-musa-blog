const mongoose = require("mongoose");

const obraSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  categoria: {
    type: String,
    required: true,
  },
});

const Obra = mongoose.model("Obra", obraSchema);

module.exports = Obra;
