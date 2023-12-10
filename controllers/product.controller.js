const puppeteer = require("puppeteer");
const db = require("../dbService");

const generateInvoicePDF = async (req, res, product) => {
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();
  const products = product;
  const firstname = loggedIn.firstname;
  const lastname = loggedIn.lastname;
  let totalPrice = 0;

  const content = `
    <div style="text-align: center;">
      <h1>Invoice</h1>
      <p>Date: ${new Date().toLocaleDateString()}</p>
      <p>Bill To:</p>
      ${firstname} ${lastname}
      <table border="1" style="width: 100%;">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        ${products
          .map((product) => {
            const total = product.quantity * product.product.price;
            totalPrice += total;
            return `
              <tr>
                <td>${product.product.name}</td>
                <td>${product.product.description}</td>
                <td>${product.quantity}</td>
                <td>${product.product.price}</td>
                <td>${total}</td>
              </tr>`;
          })
          .join("")}
        </tbody>
      </table>
      <p style="margin-top: 20px; font-weight: bold;">Total: $${totalPrice.toFixed(
        2
      )}</p>
    </div>
  `;

  await page.setContent(content);

  await page.pdf({
    path: "invoice.pdf",
    format: "A4",
  });

  await browser.close();
};

exports.getCart = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const cartItemsQuery = `SELECT * FROM cart WHERE user_id = ${userId}`;
    const productItemsQuery = `SELECT * FROM products`;

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

    const getProductItems = () => {
      return new Promise((resolve, reject) => {
        db.query(productItemsQuery, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    };

    let [cartItems, productItems] = await Promise.all([
      getCartItems(),
      getProductItems(),
    ]);
    cartItems = JSON.parse(JSON.stringify(cartItems));
    productItems = JSON.parse(JSON.stringify(productItems));

    const cartDetails = cartItems.map((cartItem) => {
      const productDetails = productItems.find(
        (product) => product.id === cartItem.product_id
      );
      return {
        ...cartItem,
        product: productDetails,
      };
    });
    req.session.cart = cartDetails;

    res.render("cart", {
      title: "Cart | GreenBasket",
      cartItems: cartDetails || [],
    });
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.addToCart = async (req, res) => {
  console.log("addToCart Page");
  try {
    const { productId } = req.body;
    req.session.cart = req.session.cart || [];

    const existingCartItemIndex = req.session.cart.findIndex((item) => {
      return item.product_id == productId;
    });

    if (existingCartItemIndex !== -1) {
      req.session.cart[existingCartItemIndex].quantity += 1;

      const updateQuery =
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
      const updateValues = [loggedIn.id, productId];
      await db.query(updateQuery, updateValues);
    } else {
      req.session.cart.push({ productId, quantity: 1 });

      const insertQuery =
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
      const insertValues = [loggedIn.id, productId, 1];
      await db.query(insertQuery, insertValues);
    }

    res.render("products", {
      title: "Home | GreenBasket",
      products: gproducts,
      message: "Item added to Cart",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

exports.buy = async (req, res) => {
  try {
    const cartProduct = req.session.cart || [];

    await generateInvoicePDF(req, res, cartProduct);
    db.query("DELETE FROM cart");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
