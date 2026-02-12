
const crypto = require("crypto");
const cashfree = require("../utils/cashfree");
const Booking = require("../models/Booking"); // Adjust path to your Booking model

// const createPaymentOrder = async (req, res) => {
//   try {
//     const { amount, customerName, customerEmail, customerPhone } = req.body;

//     const orderId = "bike_" + Date.now();

//     const response = await cashfree.post("/orders", {
//       order_id: orderId,
//       order_amount: amount,
//       order_currency: "INR",
//       customer_details: {
//         customer_id: "cust_" + Date.now(),
//         customer_name: customerName,
//         customer_email: customerEmail,
//         customer_phone: customerPhone,
//       },
//     });

//     res.json({
//       success: true,
//       orderId,
//       paymentSessionId: response.data.payment_session_id,
//     });
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to create payment order",
//     });
//   }
// };

const createPaymentOrder = async (req, res) => {
  try {
    console.log("Create order body:", req.body);

    const { amount, customerName, customerEmail, customerPhone } = req.body;

    if (!amount || !customerPhone || !customerName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const orderId = "bike_" + Date.now();

    const response = await cashfree.post("/orders", {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: "cust_" + Date.now(),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
      },
    });

    return res.status(200).json({
      success: true,
      orderId,
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (error) {
    console.error("Cashfree error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.response?.data || error.message,
    });
  }
};

/* =========================
   WEBHOOK VERIFICATION
========================= */
const verifyWebhook = async (req, res) => {
  const signature = req.headers["x-webhook-signature"];
  const rawBody = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY)
    .update(rawBody)
    .digest("base64");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid webhook signature" });
  }

  const { order_id, order_status } = req.body.data;

  if (order_status === "PAID") {
    // 🔥 Here you can:
    // 1. Mark booking as PAID
    // 2. Lock bike
    // 3. Send confirmation SMS / Email
    console.log("Payment successful for:", order_id);
  }

  res.status(200).json({ received: true });
};

// Add this to your current controller file

const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { customerId, bikeId, startDate, endDate, amount } = req.query;

    // 1. Fetch order status from Cashfree
    const response = await cashfree.get(`/orders/${orderId}`);
    const data = response.data;

    if (data.order_status === "PAID") {
      // 2. Check if booking already exists to prevent duplicates
      let booking = await Booking.findOne({ payment_order_id: orderId });

      if (!booking) {
        // 3. Create the booking record in the database
        booking = await Booking.create({
          customer_id: customerId,
          bike_id: bikeId,
          start_datetime: startDate,
          end_datetime: endDate,
          total_amount: amount,
          payment_status: "paid",
          payment_method: "online",
          payment_order_id: orderId,
          status: "confirmed",
        });
      }

      return res.status(200).json({
        success: true,
        status: "PAID",
        booking
      });
    } else {
      return res.status(400).json({
        success: false,
        status: data.order_status,
        message: "Payment not completed"
      });
    }
  } catch (error) {
    console.error("Verification error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// Update your exports
module.exports = {
  createPaymentOrder,
  verifyWebhook,
  verifyPayment // Add this
};


