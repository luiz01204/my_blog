const sequelize = require("sequelize");
const connection = require("../data/database");

const User = connection.define("users",{
    email:{
        type: sequelize.STRING,
        AllowNull: false
    },
    password:{
        type: sequelize.STRING,
        AllowNull: false
    }
});

User.sync({force: false});

module.exports = User;