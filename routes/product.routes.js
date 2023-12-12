//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const express = require("express");
const productRouter = express.Router();
const productController = require("../controllers/product.controller");
const authUserMiddleware = require("../middlewares/authMiddleware");

productRouter.get("/cart", authUserMiddleware, productController.getCart);
productRouter.post("/cart", authUserMiddleware, productController.addToCart);
productRouter.post("/buy", authUserMiddleware, productController.buy);
productRouter.post(
  "/cart/delete",
  authUserMiddleware,
  productController.deleteCartItem
);

module.exports = productRouter;
