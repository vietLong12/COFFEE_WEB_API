const express = require("express");
const router = express.Router();

const DashboardController = require("../app/controllers/DashBoardController")


router.get("/", DashboardController.getDashboard);



module.exports = router;
