const express = require("express");
const { createRentalRequest, getAllRentalRequests, updateRentalStatus, getServer } = require("../controllers/Rentalcontroller");
const router = express.Router();

router.get("/", getServer);
router.post("/", createRentalRequest);
router.get("/admin", getAllRentalRequests);
router.put("/:id/status", updateRentalStatus);

module.exports = router;
