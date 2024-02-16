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
let listComment = []
io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    index--;
    console.log('A user disconnected: ' + socket.id + ', total actives: ' + index);
  });
  socket.on("adminLive", () => {
    const temp = [...listComment]
    const slicedCommentList = temp.slice(Math.max(listComment.length - 100, 0));
    socket.emit("adminComment", slicedCommentList);
  })

  socket.on("sendComment", (data) => {
    listComment.push(data);
    const temp = [...listComment]
    const slicedCommentList = temp.slice(Math.max(listComment.length - 100, 0));
    io.emit("listComment", slicedCommentList);
    io.emit("adminComment", slicedCommentList);
  })

  socket.on("stream", (data) => {
    console.log('data: ', data);
    io.emit("live", data)
  })

  socket.on("joinLive", (data) => {
    index++;
    console.log(
      'Có người mới tham gia live: ' + socket.id + ', Tên người tham gia: ' + data
    );
    console.log(`Hiện có ${index} viewer`)
    io.emit("viewCount", index);
    io.emit("listComment", listComment);
  })
  socket.on("viewerOutLive", () => {
    index--;
    io.emit("viewCount", index - 1);
  })
});



const os = require('os');

// Lấy địa chỉ IP của máy tính
function getIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const { address, family, internal } of interface) {
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  return 'Không thể lấy địa chỉ IP';
}

// Sử dụng hàm để lấy địa chỉ IP và in ra

server.listen(port, () => {
  const ipAddress = getIPAddress();
  console.log('Địa chỉ IP của máy tính:', ipAddress);
  console.log(`App listening on port http://localhost:${port}`);
});
