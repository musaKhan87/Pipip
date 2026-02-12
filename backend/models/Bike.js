const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    cc: { type: Number, required: true },
    number_plate: { type: String, required: true, unique: true },
    price_per_hour: { type: Number, required: true },
    price_per_day: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },
    image_url: String,
    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bike", bikeSchema);

