//      Group Members
// Nitin Mishra - 8891046
// Rachna Shukla - 8922636
// Kritagya Mishra - 8899402
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
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 20px;
    }

    .invoice-container {
      width: 80%;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1, h3 {
      color: #2ecc71;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: #2ecc71;
      color: #fff;
    }

    td {
      background-color: #fff;
    }

    p {
      margin-bottom: 10px;
    }

    .total-section {
      margin-top: 20px;
      font-weight: bold;
      font-size: 1.2em;
    }
  </style>
  
  <div class="invoice-container">
    <h1>GreenBasket</h1>
    <h3>Invoice</h3>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Bill To: ${firstname} ${lastname}</p>
    <table>
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
              <td>$${product.product.price.toFixed(2)}</td>
              <td>$${total.toFixed(2)}</td>
            </tr>`;
          })
          .join("")}
      </tbody>
    </table>
    <p class="total-section">Total: $${totalPrice.toFixed(2)}</p>
  </div>
`;

  await page.setContent(content, { waitUntil: "domcontentloaded" });

  await page.pdf({
    path: "invoice.pdf",
    margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
    printBackground: true,
    format: "A4",
  });

  await browser.close();
};

// const loadCart = async (req, res) => {
//   const userId = req.session.user.id;

//   const cartItemsQuery = `SELECT * FROM cart WHERE user_id = ${userId}`;
//   const productItemsQuery = `SELECT * FROM products`;

//   const getCartItems = () => {
//     return new Promise((resolve, reject) => {
//       db.query(cartItemsQuery, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//   };

//   const getProductItems = () => {
//     return new Promise((resolve, reject) => {
//       db.query(productItemsQuery, (err, result) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(result);
//         }
//       });
//     });
//   };

//   let [cartItems, productItems] = await Promise.all([
//     getCartItems(),
//     getProductItems(),
//   ]);
//   cartItems = JSON.parse(JSON.stringify(cartItems));
//   productItems = JSON.parse(JSON.stringify(productItems));

//   const cartDetails = cartItems.map((cartItem) => {
//     const productDetails = productItems.find(
//       (product) => product.id === cartItem.product_id
//     );
//     return {
//       ...cartItem,
//       product: productDetails,
//     };
//   });

//   // console.log("getCart", cartDetails);
//   req.session.cart = cartDetails;
// };
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

    // console.log("getCart", cartDetails);
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
    const userId = req.session.user.id;

    const { productId } = req.body;
    req.session.cart = req.session.cart || [];
    console.log("addToCart 1", req.session.cart);

    const productIdInt = parseInt(productId, 10);

    const existingCartItemIndex = req.session.cart.findIndex((item) => {
      console.log("Item from existing cart", item);
      console.log(
        typeof item.product_id,
        typeof productIdInt,
        parseInt(item.product_id)
      );
      if (item.product_id == productIdInt) {
        return true;
      } else {
        return false;
      }
    });
    console.log("existingCartItemIndex", existingCartItemIndex);

    if (existingCartItemIndex !== -1) {
      req.session.cart[existingCartItemIndex].quantity += 1;

      const updateQuery =
        "UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?";
      const updateValues = [userId, productIdInt];
      await db.query(updateQuery, updateValues);
    } else {
      req.session.cart.push({ productId: productIdInt, quantity: 1 });

      const insertQuery =
        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)";
      const insertValues = [userId, productIdInt, 1];
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

exports.deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = loggedIn.id;

    req.session.cart = req.session.cart.filter(
      (item) => item.product_id !== productId
    );

    const deleteQuery = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";
    const deleteValues = [userId, productId];
    await db.query(deleteQuery, deleteValues);

    res.redirect("/grocery/cart");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
