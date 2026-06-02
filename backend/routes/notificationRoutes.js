const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Endpoint target: POST /api/notifications/subscribe
router.post("/subscribe", notificationController.subscribeDevice);

module.exports = router;
