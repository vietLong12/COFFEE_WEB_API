const express = require("express");

const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const pathfinderUI = require("pathfinder-ui");
const cors = require('cors')

const app = express();
const port = 5500;

const route = require("./routes");
const db = require("./config/db");

app.use(cors())
db.connect();

app.use(express.static(path.join(__dirname, "/public")));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  "/pathfinder",
  function (req, res, next) {
    pathfinderUI(app);
    next();
  },
  pathfinderUI.router
);

app.use(morgan("short"));

route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
