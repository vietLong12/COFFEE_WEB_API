const accountRouter = require("./account");
const productRouter = require("./product");
const cartRouter = require("./cart");

function route(app) {
  app.use("/accounts", accountRouter);

  app.use("/cart", cartRouter);

  app.use("/products", productRouter);

  app.use("/", (req, res) => {
    res.send("<h1>Welcome to API COFFEE MONSTER</h1>");
  });
}

module.exports = route;
