const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nome: String,
    email: String,
    senha: String
}, {
    versionKey: false
});

const Produto = mongoose.model("Usuario", UsuarioSchema);

module.exports = Produto;