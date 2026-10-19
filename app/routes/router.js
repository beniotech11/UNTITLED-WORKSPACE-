ROUTER.JS 

const express = require("express");

const router = express.Router();
 
const { body, validationResult } = require("express-validator");

const nodemailer = require("nodemailer");
 
// Configuração do transporte de e-mail

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 587,

    secure: false,

    requireTLS: true,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

            ? process.env.EMAIL_PASS.replace(/\s/g, "")

            : ""

    }

});
 
// Valores iniciais do formulário

function valoresVazios() {

    return {

        nome: "",

        email: "",

        telefone: "",

        assunto: "",

        mensagem: ""

    };

}
 
// Página inicial

router.get("/", (req, res) => {

    res.render("pages/index", {

        valores: valoresVazios(),

        erros: [],

        mensagem: null,

        tipoMensagem: ""

    });

});
 
// Receber, validar e enviar o formulário

router.post(

    "/index",

    [

        body("nome")

            .trim()

            .isLength({ min: 3, max: 30 })

            .withMessage("O nome deve ter entre 3 e 30 caracteres."),
 
        body("email")

            .trim()

            .isEmail()

            .withMessage("Informe um e-mail válido."),
 
        body("telefone")

            .trim()

            .isLength({ min: 8, max: 20 })

            .withMessage("Informe um telefone válido."),
 
        body("assunto")

            .trim()

            .isLength({ min: 3, max: 100 })

            .withMessage("O assunto deve ter entre 3 e 100 caracteres."),
 
        body("mensagem")

            .trim()

            .isLength({ min: 5, max: 5000 })

            .withMessage("A mensagem deve ter entre 5 e 5000 caracteres.")

    ],

    async (req, res) => {

        const resultado = validationResult(req);

        const valores = req.body;
 
        // Se houver erros, retornar ao formulário

        if (!resultado.isEmpty()) {

            return res.status(400).render("pages/index", {

                valores,

                erros: resultado.array(),

                mensagem: null,

                tipoMensagem: ""

            });

        }
 
        // Verificar se as credenciais foram configuradas

        if (

            !process.env.EMAIL_USER ||

            !process.env.EMAIL_PASS ||

            !process.env.EMAIL_DESTINO

        ) {

            console.error("Configure EMAIL_USER, EMAIL_PASS e EMAIL_DESTINO no .env.");
 
            return res.status(500).render("pages/index", {

                valores,

                erros: [],

                mensagem: "O serviço de e-mail ainda não está configurado.",

                tipoMensagem: "erro"

            });

        }
 
        const { nome, email, telefone, assunto, mensagem } = valores;
 
        try {

            await transporter.sendMail({

                from: process.env.EMAIL_USER,

                to: process.env.EMAIL_DESTINO,

                replyTo: email,

                subject: `Contato pelo site: ${assunto}`,

                text: [

                    "Novo contato recebido pelo formulário.",

                    "",

                    `Nome: ${nome}`,

                    `E-mail: ${email}`,

                    `Telefone: ${telefone}`,

                    `Assunto: ${assunto}`,

                    "",

                    "Mensagem:",

                    mensagem

                ].join("\n")

            });
 
            console.log("E-mail enviado com sucesso.");
 
            return res.render("pages/index", {

                valores: valoresVazios(),

                erros: [],

                mensagem: "Mensagem enviada com sucesso!",

                tipoMensagem: "sucesso"

            });
 
        } catch (erro) {

            console.error("Erro ao enviar e-mail:", erro);
 
            return res.status(500).render("pages/index", {

                valores,

                erros: [],

                mensagem: "Não foi possível enviar o e-mail. Verifique a configuração.",

                tipoMensagem: "erro"

            });

        }

    }

);
 
module.exports = router;

 