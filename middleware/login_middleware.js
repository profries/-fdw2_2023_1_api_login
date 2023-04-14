const jwt = require('jsonwebtoken')

exports.validarToken = (req, res, next) => {
    const token = req.get("x-auth-token");

    //Nao tem token? retorna 401
    if(!token) {
        res.status(401).json({erro: "Token Invalido"});        
    }
    else {
        try{ 
            const payload = jwt.verify(token, 'Sen@crs2023');
            if(payload) {
                console.log("Payload: ", payload);
                next();
            }
            else {
                res.status(401).json({erro: "Token Invalido"});        
            }
        } catch (err) {
            res.status(401).json({erro: "Token Invalido"});        
        }
    }
}