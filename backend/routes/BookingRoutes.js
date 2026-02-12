const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  adminCreateBooking,
} = require("../controllers/Bookingcontroller");
const upload = require("../middelwares/upload");
const router = express.Router();

// CREATE booking
router.post("/", createBooking);
router.post("/admin",upload.none(), adminCreateBooking);


// ADMIN ONLY

router.get("/", getAllBookings);
router.get("/:id", getBookingById);

router.put("/:id", updateBooking);
router.patch("/:id/status", updateBookingStatus);

router.delete("/:id", deleteBooking);

module.exports = router;
