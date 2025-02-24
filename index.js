// imports da aplicação:
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./data/database");
const { where } = require("sequelize");


const categoriesController = require("./controllers/categorieController");
const articlesController = require("./controllers/articlesController");
const userController = require("./controllers/userController");


const article = require("./models/Article");
const category = require("./models/Category");
const user = require("./models/User");


// criando app com express:
const app = express();


// conectando ao banco:
connection.authenticate().then(() =>{
    console.log("Conexão com banco realizada com sucesso!")
}).catch((err) =>{
    console.log("Ocorreu um erro: " + err);
});


// modificando a engine e apontando rota arquivos statics:
app.set("view engine", "ejs");
app.use(express.static("public"));


// configurando sessões:
app.use(session({
    secret: "euamomirely", cookie: {maxAge: 10800000}
}));


// ativando body-parser para receber dados url e json:
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// rotas principais da aplicação:
app.get("/",(req,res) =>{ // pagina inicial do blog!
    article.findAll({
        order:[
            ["id","DESC"]
        ],
        limit: 5
    }).then((articles) =>{
        category.findAll().then((categories) =>{
            res.render("index",{articles: articles , categories: categories});
        });  
    });
});


app.get("/category/:slug",(req, res) =>{ // filtra por categoria!
    var slug = req.params.slug;
    category.findOne({
        where:{
            slug: slug
        },
        include: [{
            model: article,
        }],
        order: [
            [article, "createdAt", "DESC"]
        ]
    }).then((categories) =>{
        if(categories != undefined){
            category.findAll().then((CategoryAll) =>{
                res.render("filter",{articles: categories.articles, categories: CategoryAll})
            });
        }else{
            res.redirect("/");
        }
    }).catch((error) =>{
        console.log(error);
        res.redirect("/");
    });
});

app.get("/:slug", (req,res) =>{ // pagina de leitura do artigo!
    var slug = req.params.slug;

    article.findOne({
        where:{
            slug: slug
        }
    }).then((article) =>{
        if(article != undefined){
            category.findAll().then((categories) =>{ // categorias para navbar!
                res.render("readArticle",{article: article , categories: categories});
            });  
        }else{
            res.redirect("/");
        }
    }).catch((error) =>{
        console.log(error);
        res.redirect("/");
    });
});


// rotas administrativas da aplicação:
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);


// escutando requisições na porta 8080:
app.listen(8080,() =>{
    console.log("Servidor online!");
});