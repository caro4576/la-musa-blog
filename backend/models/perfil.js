const mongoose = require("mongoose");

const perfilSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: "El artista" },
    titulo: { type: String, default: "Sobre Joaquín" },
    statement: { type: String, default: "Dibujar, escribir, imaginar.\nCrear como una forma de existir." },
    texto1: { type: String, default: "Joaquín Vignatte es artista y creador. Su trabajo nace del dibujo, la escritura, la imaginación y la construcción de mundos." },
    texto2: { type: String, default: "La Musa Incarnata reúne esas distintas formas de crear en un mismo espacio: dibujos, personajes, textos, libros y proyectos que forman parte de un proceso creativo que continúa creciendo." },
    texto3: { type: String, default: "Este sitio funciona como un archivo vivo de su obra. Un lugar para conservar lo creado, compartir lo que está en proceso y dejar espacio para lo que todavía no existe." },
  },
  { timestamps: true },
);

const Perfil = mongoose.model("Perfil", perfilSchema);

module.exports = Perfil;
