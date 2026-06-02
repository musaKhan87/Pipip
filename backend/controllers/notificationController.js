const webpush = require("web-push");
const Subscription = require("../models/Subscription");

// Configure VAPID standard identification keys
webpush.setVapidDetails(
  "mailto:16khanmusa@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

// Save admin mobile browser subscription token configuration keys
exports.subscribeDevice = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;

    if (!endpoint || !keys) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subscription payload." });
    }

    // Check if subscription already exists, if not create a new record
    await Subscription.findOneAndUpdate(
      { endpoint },
      { endpoint, keys },
      { upsert: true, new: true },
    );

    res
      .status(201)
      .json({ success: true, message: "Smart device synced successfully." });
  } catch (error) {
    console.error("Subscription Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to link notification stream." });
  }
};

/**
 * Global Real-time Dispatch Hook Engine
 * Call this directly in your Checkout/Booking Controller right after an online transaction saves!
 * Example: sendOrderAlerts(savedBookingDoc, req.app.get("io"));
 */
exports.sendOrderAlerts = async (orderData, io) => {
  const alertText = `📦 ${orderData.customer_name || "Customer"} placed an online order!\n💰 Total: ₹${orderData.total_amount || 0}\n🛵 Model: ${orderData.vehicle_make_model || "Scooter"}`;

  // 1. Instant WebSocket push for dashboard screens currently active on monitor
  if (io) {
    io.emit("newOnlineOrderStream", {
      id: Date.now(),
      title: "🔔 New Online Order!",
      message: alertText.replace(/\n/g, " | "),
      type: "order",
      time: "Just Now",
      bookingData: orderData,
    });
  }

  // 2. Encrypted background push message layout architecture for locked phone screen states
  const pushPayload = JSON.stringify({
    title: "🔔 New Pipip Online Booking!",
    body: alertText,
    icon: "/logo.jpeg",
    badge: "/logo.jpeg",
    url: "/admin/panel/notifications",
  });

  try {
    const subscriptions = await Subscription.find({});

    subscriptions.forEach((sub) => {
      webpush.sendNotification(sub, pushPayload).catch(async (err) => {
        console.error("Failed to send web-push notification to subscription endpoint:", sub.endpoint, err);
        // Automatically prune old or revoked device tokens if a manager resets browser settings
        if (err.statusCode === 410 || err.statusCode === 404) {
          await Subscription.deleteOne({ _id: sub._id });
        }
      });
    });
  } catch (err) {
    console.error("Web Push broadcasting delivery engine exception:", err);
  }
};
