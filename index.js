//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const router = require("./routes");

const errorHandler = require("./middlewares/error-handler");
const authUserMiddleware = require("./middlewares/authMiddleware");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(
  session({ secret: "greenbasket", resave: true, saveUninitialized: true })
);
global.loggedIn = null;
global.gproducts = null;

// Routes
app.use(router);
app.use(authUserMiddleware);
// app.use(errorHandler);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
