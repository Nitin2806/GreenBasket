const authRouter = require("./auth.routes");
const viewRouter = require("./view.routes");
const productRouter = require("./product.routes");
const mainRouter = require("express").Router();

mainRouter.use("/", viewRouter);
mainRouter.use("/grocery", productRouter);
mainRouter.use("/user", authRouter);

module.exports = mainRouter;
