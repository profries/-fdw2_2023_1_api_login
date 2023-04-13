const Usuario = require("../model/usuario");

exports.listar = async (req, res) => { 
    try{ 
        const usuarios = await Usuario.find();
        res.json(usuarios);
    }
    catch(err) {
        res.status(500).json({Erro:err});
    }
}

exports.buscarPorId = async (req, res) => { 
    const id = req.params.id;

    try{ 

        let usuarioEncontrado = await Usuario.findById(id);
        if(usuarioEncontrado){ 
            const usuarioEncontradoSemSenha = Object.assign({}, {
                _id: usuarioEncontrado.id, 
                nome: usuarioEncontrado.nome, 
                email: usuarioEncontrado.email
            })
            return res.json(usuarioEncontradoSemSenha);
        }
        else {
            return res.status(404).json({ Erro: "Usuario nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            
}

exports.inserir = async (req, res) => { 
    //receber o usuario
    const usuarioRequest = req.body;
    //validar os dados
    if(usuarioRequest && usuarioRequest.nome 
        && usuarioRequest.email && usuarioRequest.senha){
        //se OK, cadastro os usuarios e retorno 201
        const usuarioNovo = new Usuario(usuarioRequest);

        try{ 
            const usuarioSalvo = await usuarioNovo.save();
            return res.status(201).json(usuarioSalvo);
        }
        catch(err) { 
            res.status(500).json({Erro:err});
        }
    }
    else{
        //senao retorna 400
        return res.status(400).json({
            Erro: "Nome, email e/ou senha sao obrigatorios"
        });
    }
}

exports.atualizar = async (req, res) => { 
    const id = req.params.id;
    const usuarioAlterar = req.body;

    if(!usuarioAlterar || !usuarioAlterar.nome 
        || !usuarioAlterar.email || !usuarioAlterar.senha){
        return res.status(400).json({
            Erro: "Nome, email e/ou senha sao obrigatorios"
        });
    }

    try{ 
        const usuarioAtualizado = await Usuario.findByIdAndUpdate(id, usuarioAlterar, {new: true});
        if(usuarioAtualizado){ 
            return res.json(usuarioAtualizado);
        }
        else {
            return res.status(404).json({ Erro: "Usuario nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            

}

exports.deletar = async (req, res) => { 
    const id = req.params.id;

    try{ 
        const usuarioDeletado = await Usuario.findByIdAndDelete(id);
        if(usuarioDeletado){ 
            return res.json(usuarioDeletado);
        }
        else {
            return res.status(404).json({ Erro: "Usuario nao encontrado"});
        }
    } catch(err) {
        res.status(500).json({Erro:err});
    }            

}
