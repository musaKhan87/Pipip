// routes/reportRoutes.js
const express = require("express");
const { getDailyRevenueReport, getBikeRevenueReport, getBookingStats, getIdleBikesReport, getEndingSoon, getRecentlyExpired } = require("../controllers/reportController");
const router = express.Router();

router.get("/stats", getBookingStats);
router.get("/bike-revenue", getBikeRevenueReport);
router.get("/idle-bikes", getIdleBikesReport);
router.get("/daily-revenue", getDailyRevenueReport);

router.get("/ending-soon", getEndingSoon);
router.get("/recently-expired", getRecentlyExpired);

module.exports = router;
