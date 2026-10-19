APP.JS

require("dotenv").config();
 
const express = require("express");

const path = require("path");
 
const app = express();

const porta = process.env.APP_PORT || 3000;
 
// Configuração do EJS

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "app", "views"));
 
// Arquivos estáticos: CSS, imagens e JavaScript

app.use(

    express.static(path.join(__dirname, "app", "public"))

);
 
// Recebimento dos dados

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
 
// Rotas

const router = require("./app/routes/router");

app.use("/", router);
 
// Rota para páginas inexistentes

app.use((req, res) => {

    res.status(404).send("Página não encontrada.");

});
 
// Inicialização do servidor

app.listen(porta, () => {

    console.log(`Servidor on-line em http://localhost:${porta}`);

});

 
.ENV
 