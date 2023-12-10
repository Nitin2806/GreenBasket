module.exports = (error, req, res, next) => {
  res.render("error", {
    title: "500 | GreenBasket",
    error: error.message || "",
  });
  next();
};
