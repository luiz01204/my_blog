const sequelize = require("sequelize");
const connection = require("../data/database");
const category = require("./Category");

const Article = connection.define("articles",{
    title:{
        type: sequelize.STRING,
        allowNull: false
    },
    slug:{
        type: sequelize.STRING,
        allowNull: false
    },
    body:{
        type: sequelize.TEXT,
        allowNull: false
    }
});

Article.belongsTo(category); // Um artigo pertence a uma categoria.
category.hasMany(Article); // uma categoria tem muitos artigos.

Article.sync({force: false});

module.exports = Article; 