//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const express = require("express");
const viewRouter = express.Router();
const viewController = require("../controllers/view.controller");
const authUserMiddleware = require("../middlewares/authMiddleware");

viewRouter.get("/", viewController.home);
viewRouter.get("/products", authUserMiddleware, viewController.products);
viewRouter.get("/contact", viewController.contact);
viewRouter.get("/about", viewController.about);
viewRouter.get("/login", viewController.login);
viewRouter.get("/register", viewController.register);
viewRouter.post("/contact", viewController.contactform);

module.exports = viewRouter;
