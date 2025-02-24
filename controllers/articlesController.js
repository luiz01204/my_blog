const express = require("express");
const slugify = require("slugify");
const router = express.Router();
const articles = require("../models/Article");
const category = require("../models/Category");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles", adminAuth, (req,res) =>{ // tela principal admin!
    articles.findAll({
        include: [
            {model: category} // inclui categorias do relacionamento!
        ],
        order: [
            ["id","DESC"]
        ]
    }).then((articles) =>{
        res.render("admin/articles/articles",{articles: articles});
    });
});

router.get("/admin/articles/new", adminAuth, (req,res) =>{ // cria novo artigo!
    category.findAll().then((categories) =>{
        res.render("admin/articles/new",{categories: categories});
    });
});

router.post("/admin/articles/save", adminAuth, (req,res) =>{ // salva novo artigo!
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;

    articles.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() =>{
        res.redirect("/admin/articles");
    })
});

router.post("/admin/articles/delete", adminAuth, (req,res) =>{ // rota para botão deletar artigo!
    var id = req.body.id;

    if(id != undefined){
        if(id != NaN){
            articles.destroy({
                where:{
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/articles");
            })
        }else{
            res.redirect("/admin/articles");
        }
    }else{
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", adminAuth, (req,res) =>{ // rota para tela de edição artigo!
    var id = req.params.id;
    articles.findByPk(id).then((article) =>{
        if(article != undefined){
            category.findAll().then((categories) =>{
                res.render("admin/articles/edit",{article: article, categories: categories});
            })
        }else{
            res.redirect("/admin/articles");
        }
    }).catch((error) =>{
        console.log(error);
        res.redirect("/admin/articles");
    });
});

router.post("/admin/articles/update", adminAuth, (req,res) =>{ // rota para salvar edição artigo! 
    var id = req.body.id;
    var title = req.body.title;
    var category = req.body.category;
    var body = req.body.body;

    articles.update({
        id: id,
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    },
    {       
        where:{
            id: id
        }
    }).then(() =>{
        res.redirect("/admin/articles");
    });
});

router.get("/pages/:num", (req,res) =>{ // paginação do blog por artigo! 
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt(page)* 5;
    }

    articles.findAndCountAll({ // retorna: count e rows(artigos)!
        limit: 5,
        offset: offset,
        order: [
            ["id","DESC"]
        ]
    }).then((articles) =>{

        var next;
        if(offset + 5 > articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles : articles
        }

        category.findAll().then((categories) =>{ // para categorias da navbar
            res.render("pages",{result: result, categories: categories})
        });
    });  
});

module.exports = router;