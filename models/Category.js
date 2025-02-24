const sequelize = require("sequelize");
const connection = require("../data/database");

const Category = connection.define("categories",{
    title:{
        type: sequelize.STRING,
        AllowNull: false
    },
    slug:{
        type: sequelize.STRING,
        AllowNull: false
    }
});

Category.sync({force: false});

module.exports = Category;