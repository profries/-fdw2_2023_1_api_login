const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
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
        
        console.log("Senha 1:", usuarioNovo.senha);
        usuarioNovo.senha = await bcrypt.hash(usuarioRequest.senha, 10);
        console.log("Senha 2:", usuarioNovo.senha);

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

exports.buscarUsuario = async (req, res) => {
    if(req.query && req.query.email){
        try{ 
            let usuarioEncontrado = await Usuario.findOne({email: req.query.email});
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
    else {
        res.status(400).json({Erro: "Faltou o parametro email"})
    }

}

exports.validarLogin = async (req, res) => {
    if(req.body && req.body.email && req.body.senha){
        try{
            let usuarioEncontrado = await Usuario.findOne({email: req.body.email});

            const validaSenha = await bcrypt.compare(req.body.senha, usuarioEncontrado.senha)
            if(usuarioEncontrado && validaSenha){ 
                const token = jwt.sign({
                    id: usuarioEncontrado.id                    
                }, 'Sen@crs2023', { expiresIn: "1h"}); 
                res.status(201).json({token: token})
            }
            else {
                res.status(401).json({Erro: "Usuario ou senha invalidos"});
            }
        } catch(err) {
            res.status(500).json({Erro:err});
        }                    
    }
    else {
        res.status(401).json({Erro: "Usuario ou senha invalidos"});
    }
}
