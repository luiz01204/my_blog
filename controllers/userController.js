const e = require("express");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { where } = require("sequelize");
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/users", adminAuth, (req,res) =>{
    User.findAll().then((users) =>{
        res.render("admin/users/users.ejs",{users: users});
    });
});

router.get("/admin/users/create",  adminAuth, (req,res) =>{
    res.render("admin/users/create");
});

router.post("/admin/users/save", adminAuth, (req,res) =>{
    console.log("Dados recebidos:", req.body);
    var email = req.body.email;
    var pass = req.body.password[0];

    User.findOne({where: {email: email}}).then((user) =>{
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(pass,salt);

            User.create({
                email: email,
                password: hash
            }).then(() =>{
                res.redirect("/admin/users");
            }).catch((error) =>{
                console.log(error);
                res.redirect("/admin/users");
            });
        }else{
            res.redirect("/admin/users");
        }    
    });
});

router.post("/admin/users/delete", adminAuth, (req,res) =>{
    var id = req.body.id;

    User.destroy({
        where:{
            id: id
        }
    }).then(() =>{
        res.redirect("/admin/users");
    }).catch((error) =>{
        console.log(error);
        res.redirect("/admin/users");
    })
});

router.get("/admin/login",(req,res) =>{
    res.render("admin/users/login");
});

router.post("/admin/authenticate",(req,res) =>{
    var email = req.body.email;
    var pass = req.body.password;

    User.findOne({where: {email: email}}).then((user) =>{
        if(user != undefined){
            var correct = bcrypt.compareSync(pass, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email : user.email
                }

                res.redirect("/admin/articles");

            }else{
                res.redirect("/admin/login");
            }
        }else{
            res.redirect("/admin/login");
        }
    });
});

router.get("/admin/logout", adminAuth, (req,res) =>{
    req.session.user = undefined;
    res.redirect("/")
});

module.exports = router;