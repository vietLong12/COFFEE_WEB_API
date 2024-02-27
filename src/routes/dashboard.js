const express = require("express");
const router = express.Router();

const DashboardController = require("../app/controllers/DashBoardController");
const verifyToken = require("../middleware/auth");


router.get("/infor", verifyToken, DashboardController.getDashboard);
router.get("/chart", verifyToken, DashboardController.getChart);



module.exports = router;
