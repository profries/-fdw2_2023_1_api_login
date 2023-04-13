const Produto = require("../model/produto");

exports.listar = async (req, res) => { 
    try{ 
        const produtos = await Produto.find();
        res.json(produtos);
    }
    catch(err) {
        res.status(500).json({Erro:err});
    }
}

exports.buscarPorId = async (req, res) => { 
    const id = req.params.id;

    try{ 

        const produtoEncontrado = await Produto.findById(id);
        if(produtoEncontrado){ 
            return res.json(produtoEncontrado);
        }
        else {
            return res.status(404).json({ Erro: "Produto nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            
}

exports.inserir = async (req, res) => { 
    //receber o produto
    const produtoRequest = req.body;
    //validar os dados
    if(produtoRequest && produtoRequest.nome && produtoRequest.preco){
        //se OK, cadastro os produtos e retorno 201
        const produtoNovo = new Produto(produtoRequest);

        try{ 
            const produtoSalvo = await produtoNovo.save();
            return res.status(201).json(produtoSalvo);
        }
        catch(err) { 
            res.status(500).json({Erro:err});
        }
    }
    else{
        //senao retorna 400
        return res.status(400).json({
            Erro: "Nome e/ou preco sao obrigatorios"
        });
    }
}

exports.atualizar = async (req, res) => { 
    const id = req.params.id;
    const produtoAlterar = req.body;

    if(!produtoAlterar || !produtoAlterar.nome || !produtoAlterar.preco){
        return res.status(400).json({
            Erro: "Nome e/ou preco sao obrigatorios"
        });
    }

    try{ 
        const produtoAtualizado = await Produto.findByIdAndUpdate(id, produtoAlterar, {new: true});
        if(produtoAtualizado){ 
            return res.json(produtoAtualizado);
        }
        else {
            return res.status(404).json({ Erro: "Produto nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            

}

exports.deletar = async (req, res) => { 
    const id = req.params.id;

    try{ 
        const produtoADeletado = await Produto.findByIdAndDelete(id);
        if(produtoADeletado){ 
            return res.json(produtoADeletado);
        }
        else {
            return res.status(404).json({ Erro: "Produto nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            

}
