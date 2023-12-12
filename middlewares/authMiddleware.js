//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const db = require("../dbService");

const authUserMiddleware = (req, res, next) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/");
  }

  const userVerification = "SELECT * FROM users WHERE id = ?";

  db.query(userVerification, [req.session.user.id], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).send("Internal Server Error");
    }

    if (result.length === 0) {
      return res.redirect("/");
    }

    req.user = result[0];

    next();
  });
};

module.exports = authUserMiddleware;
