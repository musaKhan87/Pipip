const express = require("express");
const { checkAvailability } = require("../controllers/Availablitycontroller");
const router = express.Router();

// CHECK availability
router.post("/", checkAvailability);

module.exports = router;
