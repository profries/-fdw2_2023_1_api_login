const express = require('express');
const { default: mongoose } = require('mongoose');
const rotaProduto = require('./rotas/produto_rotas')
const rotaUsuario = require('./rotas/usuario_rotas')
const rotaLogin = require('./rotas/login_rotas')
const loginMiddleware = require('./middleware/login_middleware')


const app = express();
const PORTA = 3000;

const trataLog = (req, res, next) => {
    console.log("[REQUEST]", `${req.method} ${req.originalUrl}`);
    next();
    console.log("[RESPONSE]", `${res.statusCode}`);
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Configuração da conexão com o Mongo
mongoose.connect('mongodb://127.0.0.1:27017/app_produtos')
    .then(() => {
        console.log("Conectado ao MongoDB..");
    }).catch((error) => {
        console.log("Erro:", error)
    });

app.use(trataLog);

app.use('/api/login', rotaLogin)

app.use('/api/usuarios', rotaUsuario);

app.use(loginMiddleware.validarToken)

app.use('/api/produtos', rotaProduto);


app.listen(PORTA, () => {
    console.log(`Servidor iniciado na porta ${PORTA}`);
})