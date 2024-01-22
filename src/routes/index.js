const accountRouter = require("./account");
const productRouter = require("./product");
const orderRouter = require("./order");
const authRouter = require("./auth");
const contactRouter = require("./contact");
const fileUploader = require("../util/configs");

const handleImage = async (req, res) => {
  return res.json(req.file)
}

function route(app) {
  app.use("/accounts", accountRouter);

  app.use("/orders", orderRouter);

  app.use("/products", productRouter);

  app.use("/auth", authRouter);

  app.use("/contacts", contactRouter)

  app.post("/image", fileUploader.single("file"), handleImage)


  app.use("/", (req, res) => {
    res.status(400).json({
      status: "error",
      code: 404,
      msg: "Invalid URL",
      timestamp: new Date().toLocaleString()
    });
  });
}

module.exports = route;
