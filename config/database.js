const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("grocery_store", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
