const mysql = require("mysql");

let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "grocery_store",
});

const createDatabaseIfNotExists = () => {
  db.query("CREATE DATABASE IF NOT EXISTS grocery_store", (err) => {
    if (err) {
      console.error("Error creating database:", err.message);
      return;
    }

    db.query("USE grocery_store");
    console.log("Connected to the grocery_store database!");
  });
};
createDatabaseIfNotExists();
module.exports = db;
