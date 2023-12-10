const express = require("express");
const authRouter = express.Router();
const productController = require("../controllers/auth.controller");

authRouter.get("/login", productController.login);
authRouter.post("/login", productController.verifyLogin);
authRouter.post("/signup", productController.createAccount);
authRouter.get("/signup", productController.signup);

module.exports = authRouter;
