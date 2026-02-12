const express = require("express");
const {
  createPaymentOrder,
  verifyWebhook,
  verifyPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.get("/verify/:orderId", verifyPayment);
router.post("/create-order", createPaymentOrder);
router.post("/webhook", verifyWebhook);

module.exports = router;
