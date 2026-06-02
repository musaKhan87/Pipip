const express = require("express");
const {
  createCustomer,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  getCustomerBookings,
} = require("../controllers/Customercontroller");
const upload = require("../middelwares/upload");
const router = express.Router();

// CREATE customer (aadhaar OR license OR both)
// router.post(
//   "/",
//   upload.fields([
//     { name: "aadhaar_image", maxCount: 1 },
//     { name: "license_image", maxCount: 1 },
//   ]),
//   createCustomer,
// );

router.get("/", getCustomer);

// router.put("/:id", updateCustomer);

// routes/CustomerRoutes.js

router.post(
  "/",
  upload.fields([
    { name: "aadhaar_image", maxCount: 1 },
    { name: "license_image", maxCount: 1 },
    { name: "extra_documents", maxCount: 5 }, // Added this
  ]),
  createCustomer,
);

router.put(
  "/:id",
  upload.fields([
    { name: "aadhaar_image", maxCount: 1 },
    { name: "license_image", maxCount: 1 },
    { name: "extra_documents", maxCount: 5 }, // Added this
  ]),
  updateCustomer,
);
router.delete("/:id", deleteCustomer);

// booking history
router.get("/:id/bookings", getCustomerBookings);

module.exports = router;
