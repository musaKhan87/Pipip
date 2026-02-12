const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bike_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    start_datetime: { type: Date, required: true },
    end_datetime: { type: Date, required: true },
    total_amount: { type: Number, required: true },

    // --- ADD THESE THREE FIELDS ---
    payment_method: {
      type: String,
      enum: ["online", "cash"],
      required: true,
      default: "online",
    },
    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    payment_order_id: {
      type: String, // To store the Cashfree Order ID for tracking
    },
    // ------------------------------

    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },
    notes: String,
    updated_by_admin: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);
