//Carregando modulos.
const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const admin = require('./routes/admin')
const app = express()
const path = require('path')
const session = require('express-session')
const flash=require('connect-flash')


//Configurações
    //Sessao
        app.use(session({
            secret:'cursodenode',
            resave:true,    
            saveUninitialized:true
        }))
        app.use(flash())
    //Midleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash('success_msg')//Variasveis globais de mensagens
            res.locals.error_msg = req.flash('error_msg')
            next()
        })
    //BodyParser
    app.use(bodyParser.urlencoded({extended:true}))
    app.use(bodyParser.json())
    //Handlebars
    app.engine('handlebars',handlebars({defaultLayout:'main'}))
    app.set('view engine ','handlebars')
    //Mongoose
    mongoose.Promise=global.Promise    
    mongoose.connect('mongodb://localhost/blogapp',{ useNewUrlParser: true }).then(()=>{
            console.log('Conectado ao mongo')}).catch((err)=>{
                console.log('Erro',err)
            })
    //Public 
    app.use('/public',express.static('public'));
    

//Rotas
app.use('/admin',admin)


//Outros
const port = 8081  
app.listen(port,()=>{console.log('Servidor rodando na porta 8081')})


