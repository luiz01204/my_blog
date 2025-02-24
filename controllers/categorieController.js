const express = require("express");
const router = express.Router();
const category = require("../models/Category");
const slugify = require("slugify");
const { where } = require("sequelize");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/categories/new", adminAuth, (req, res) =>{
    res.render("admin/categories/new");
});

router.post("/admin/categories/save", adminAuth, (req,res) =>{
    var title = req.body.title;

    if(title != undefined){

        category.create({
            title: title,
            slug: slugify(title)
        }).then(() => res.redirect("/admin/categories"));

    }else{
        res.redirect("/admin/categories/new");
    }
});

router.get("/admin/categories", adminAuth, (req,res) =>{
    category.findAll().then((categories) =>{
        res.render("admin/categories/categories",{categories: categories});
    });
});

router.post("/admin/categories/delete", adminAuth, (req,res) =>{
    var id = req.body.id;

    if(id != undefined){
        if(id != NaN){
            category.destroy({
                where:{
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/categories");
            })
        }else{
            res.redirect("/admin/categories");
        }
    }else{
        res.redirect("/admin/categories");
    }
});

router.get("/admin/categories/edit/:id", adminAuth, (req,res) =>{
    var id = req.params.id;
    category.findByPk(id).then((categorie) =>{
        if(categorie != undefined){
            res.render("admin/categories/edit", {categorie: categorie})
        }else{
            res.redirect("/admin/categories");
        }
    }).catch((error) =>{
        console.log(error);
        res.redirect("/admin/categories");
    });
});

router.post("/admin/categories/update", adminAuth, (req,res) =>{
    var id = req.body.id;
    var title = req.body.title;

    category.update({title: title},{
        where:{
            id: id
        }
    }).then(() =>{
        res.redirect("/admin/categories");
    })
});

module.exports = router;