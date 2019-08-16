const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Categoria')

const Categoria = mongoose.model('categorias')
const posts = require('../models/Postagem')


router.get('/',(req,res)=>{
    res.render('../views/admin/index.handlebars')
})
router.get('/posts',(req,res)=>{
    res.send('Pagina de posts')
})
router.get('/categorias',(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('../views/admin/categorias.handlebars',{categoria:categorias})

    }).catch((erro)=>{
        req.flash('erro_msg','Houve um erro ao listar as categorias ')
        res.redirect('../views/admin/index.handlebars')
    })
  
})

router.get('/categoria/add',(req,res)=>{
    res.render('../views/admin/addcategoria.handlebars')
})
//Rota de validação de Categorias
router.post('/categorias/nova',(req,res)=>{
    //Validando Categorias
    var erros = []
    if (!req.body.nome || typeof req.body.nome==undefined || req.body.nome==null){
        erros.push({texto:"Nome inválido"})

    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug==null){
        erros.push({texto:'Slug inválido'})
    }
    if (req.body.nome.length<2){
        erros.push({texto:'Nome da Categoria muito pequeno'})
    }
    if (erros.length > 0 ){
        res.render('../views/admin/addcategoria.handlebars',{erros : erros})
    }else{
        const novaCategoria = {
            nome:req.body.nome,
            slug:req.body.slug
        }
        new Categoria(novaCategoria).save().then(()=>{
            req.flash('success_msg','Categoria criada com sucesso!')
            res.redirect("/admin/categorias")
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro ao salvar a categoria, tente novamente')
            res.redirect('/admin')
        })

    }
    
    
  
})
//Rota de edição de categoria
router.get('/categorias/edit/:id',(req,res)=>{
    Categoria.findOne({_id:req.params.id}).then((categoria)=>{
        res.render('../views/admin/editcategorias.handlebars',{categoria:categoria})
        
    })
    .catch((err)=>{
        req.flash('error_msg','Esta Categoria não existe')
        res.redirect('/admin/categorias')
    })
   
})

router.post('/categorias/edit',(req,res)=>{
    Categoria.findOne({_id:req.body.id}).then((categoria)=>{
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        
        categoria.save().then(()=>{
            req.flash('success_msg','Categoria editado com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err)=>{
            req.flash('error_msg','Houve um erro em editar a categoria')
            res.redirect('/admin/categorias')
        })



    }).catch((err)=>{
        req.flash('error_msg','Houve um erro em editar a categoria')
        res.redirect('/admin/categorias')
    })
})

router.post('/categorias/deletar',(req,res)=>{
    Categoria.remove({_id:req.body.id}).then(()=>{
        req.flash("success_msg","Categoria deletada com sucesso")
        res.redirect("/admin/categorias")
    }).catch(error=>{
        req.flash("error_msg",`Houve um erro em deletar a categoria ${error}`)
        res.redirect("/admin/categorias")
    })
})
router.get('/postagens',(req,res)=>{
    res.render('../views/admin/postagens.handlebars')
})
router.post('/postagens/nova',(req,res)=>{
    let error=[]
    if(req.body.categoria == '0'){

    }
    if(error.length > 0){
        res.render('..views/admin/addpostagem.handlebars',{error:error})
    }else{
        const novaPostagem={
           titulo:req.body.titulo,
            slug:req.body.slug,
            descricao:req.body.descricao,
            conteudo:req.body.conteudo,
            categoria:req.body.categoria
        }
        new posts(novaPostagem).save().then(()=>{
            req.flash('success_msg','Sucesso em cadastrar a postagem')
            req.redirect('/admin')
        }).catch((error)=>{
            req.flash('error_msg',`Houve um erro em cadastrar a categoria ${error}`)
        })

    }
    
})
router.get('/postagens/add',(req,res)=>{
    Categoria.find().then((categorias)=>{
        res.render('../views/admin/addpostagem.handlebars',{categorias:categorias})
    }).catch((error)=>{
        req.flash('error_msg',`Houve um erro ${error}`)
        res.redirect('/admin')
    })
})
router.get('/postagens/lista',(req,res)=>{
    posts.find().then((posts)=>{
        res.render('../views/admin/listagemPostagens.handlebars',{posts:posts})
    }).catch((error)=>{
        req.flash('error_msg',`Houve um erro ${error}`)
    })
})
    

module.exports = router
