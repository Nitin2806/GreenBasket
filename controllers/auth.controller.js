//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const db = require("../dbService");

exports.signup = (req, res) => {
  try {
    res.render("register", { error: "", title: "Sign Up | GreenBasket" });
  } catch (err) {
    return res.status(500);
  }
};
exports.login = (req, res) => {
  try {
    res.render("login", { error: "", title: "Login | GreenBasket" });
  } catch (err) {
    return res.status(500);
  }
};
exports.createAccount = (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    const query =
      "INSERT INTO users (username,first_name,last_name,email, password) VALUES (?, ?,?, ?, ?)";
    db.query(
      query,
      [username, firstname, lastname, email, password],
      (err, results) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          res.status(500).send("Internal Server Error");
        } else {
          console.log("User signed up successfully");
          res.render("login");
        }
      }
    );
    res.render("login", { error: "", title: "Login | GreenBasket" });
  } catch (err) {
    return res.status(500);
  }
};

exports.verifyLogin = (req, res) => {
  try {
    const { username, password } = req.body;

    const query = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Internal Server Error");
      } else {
        if (results.length > 0) {
          req.session.user = {
            id: results[0].id,
            username: results[0].username,
            firstname: results[0].first_name,
            lastname: results[0].last_name,
          };
          loggedIn = req.session.user;

          res.redirect("/");
        } else {
          res.render("login", { error: "Invalid username or password" });
        }
      }
    });
  } catch (err) {
    return res.status(500);
  }
};

exports.logout = (req, res) => {
  console.log("Logout");
  loggedIn = null;
  req.session.destroy(() => {
    res.redirect("/");
  });
};
