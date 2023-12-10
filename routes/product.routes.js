const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");

productRouter.get("/cart", productController.getCart);
productRouter.post("/cart", productController.addToCart);
productRouter.post("/buy", productController.buy);

module.exports = productRouter;
