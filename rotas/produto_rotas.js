const express = require('express');
const produtoController = require('../controller/produto_controller');

const router = express.Router();

//Rota do recurso: '/api/produtos'

router.get("/", produtoController.listar);

router.get("/:id", produtoController.buscarPorId)

router.post("/", produtoController.inserir)

router.put("/:id", produtoController.atualizar)

router.delete("/:id", produtoController.deletar)

module.exports = router;