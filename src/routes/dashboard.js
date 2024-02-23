const express = require("express");
const router = express.Router();

const DashboardController = require("../app/controllers/DashBoardController")


router.get("/infor", DashboardController.getDashboard);
router.get("/chart", DashboardController.getChart);



module.exports = router;
