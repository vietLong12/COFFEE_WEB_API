const express = require("express");

const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const pathfinderUI = require("pathfinder-ui");
const multer = require('multer');

const cors = require('cors')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/images"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const app = express();
const port = 5500;

const route = require("./routes");
const db = require("./config/db");

app.use(cors())
db.connect();

app.use(express.static(path.join(__dirname, "/public")));

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
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
