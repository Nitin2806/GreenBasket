//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const express = require("express");
const authRouter = express.Router();
const productController = require("../controllers/auth.controller");

authRouter.get("/login", productController.login);
authRouter.get("/signup", productController.signup);
authRouter.get("/logout", productController.logout);

authRouter.post("/login", productController.verifyLogin);
authRouter.post("/signup", productController.createAccount);

module.exports = authRouter;
