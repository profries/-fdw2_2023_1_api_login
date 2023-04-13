const mongoose = require('mongoose');

const ProdutoSchema = new mongoose.Schema({
    nome: String,
    preco: Number
}, {
    versionKey: false
});

const Produto = mongoose.model("Produto", ProdutoSchema);

module.exports = Produto;