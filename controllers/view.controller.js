//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
const db = require("../dbService");

exports.home = (req, res) => {
  res.render("home", { title: "Home | GreenBasket" });
};

exports.products = async (req, res) => {
  const createTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255)
  );
`;
  const userId = req.session.user.id;

  const cartItemsQuery = `SELECT * FROM cart WHERE user_id = ${userId}`;

  const getCartItems = () => {
    return new Promise((resolve, reject) => {
      db.query(cartItemsQuery, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
  let [cartItems] = await Promise.all([getCartItems()]);
  cartItems = JSON.parse(JSON.stringify(cartItems));
  req.session.cart = cartItems;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating database table:", err.message);
      return res.status(500).send("Internal Server Error");
    } else {
      const selectProductsQuery = "SELECT * FROM products";

      db.query(selectProductsQuery, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return res.status(500).send("Internal Server Error");
        }
        gproducts = result;
        res.render("products", {
          title: "Products | GreenBasket",
          products: result,
          message: "",
        });
      });
    }
  });
};

exports.about = (req, res) => {
  res.render("about", { title: "About Us | GreenBasket" });
};
exports.contact = (req, res) => {
  res.render("contact", { title: "Contact | GreenBasket" });
};
exports.login = (req, res) => {
  res.render("login", { title: "Login | GreenBasket" });
};
exports.register = (req, res) => {
  res.render("register", { title: "Register | GreenBasket" });
};
