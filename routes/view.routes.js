const express = require("express");
const viewRouter = express.Router();
const viewController = require("../controllers/view.controller");

viewRouter.get("/", viewController.home);
viewRouter.get("/products", viewController.products);
viewRouter.get("/contact", viewController.contact);
viewRouter.get("/about", viewController.about);
viewRouter.get("/login", viewController.login);
viewRouter.get("/register", viewController.register);

module.exports = viewRouter;
