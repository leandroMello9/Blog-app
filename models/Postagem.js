const {Schema,model} = require('mongoose')

const Postagem = new Schema({
    titulo:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
    },
    descricao:{
        type:String,
        required:true,

    },
    conteudo:{
        type:String,
        required:true,
    },
    categoria:{
        type:Schema.Types.ObjectId,
        referencia:"categorias",
        required:true,  
    },
    data:{
        type:Date,
        default:Date.now(),
    },
    
},{
    timestamps:true,
})
module.exports=model('postagem',Postagem)