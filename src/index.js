const express = require("express");

const morgan = require("morgan");
const path = require("path");
const bodyParser = require("body-parser");
const pathfinderUI = require("pathfinder-ui");
const multer = require('multer');

const cors = require('cors')

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('file: ', file);
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


const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
})



app.use(cors())
db.connect();

app.use(express.static(path.join(__dirname, "/public")));


app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

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

let index = 0;
io.on('connection', (socket) => {
  index++;
  console.log(
    'A new user connected: ' + socket.id + ', total actives: ' + index
  );
  socket.on('disconnect', () => {
    index--;
    console.log('A user disconnected: ' + socket.id + ', total actives: ' + index);
  });

  socket.on("joinLive", (data) => {
    console.log("Co nguoi moi dang nhap")
    socket.emit("viewCount", index);
  })
});
server.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
