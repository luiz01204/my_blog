const sequelize = require("sequelize");

const connection = new sequelize("my_blog","root","029599012",{
    host: "localhost",
    dialect: "mysql",
    timezone: "-03:00"
});

module.exports = connection;