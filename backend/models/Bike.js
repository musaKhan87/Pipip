// const mongoose = require("mongoose");

// const bikeSchema = new mongoose.Schema(
//   {
//     model: { type: String, required: true },
//     cc: { type: Number, required: true },
//     number_plate: { type: String, required: true, unique: true },
//     price_per_hour: { type: Number, required: true },
//     price_per_day: { type: Number, required: true },
//     status: {
//       type: String,
//       enum: ["available", "booked", "maintenance"],
//       default: "available",
//     },
//     image_url: String,
//     area_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Area",
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Bike", bikeSchema);

const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema(
  {
    // Basic Bike Details
    bike_name: { type: String, required: true },
    model: { type: String, required: true },
    cc: { type: Number, required: true },

    // Registration
    number_plate: { type: String, required: true, unique: true },
    bike_colour: { type: String },
    bike_owner: { type: String },

    // Pricing
    price_per_hour: { type: Number, required: true },
    price_per_day: { type: Number, required: true },

    // Bike Status
    status: {
      type: String,
      enum: ["available", "booked", "maintenance"],
      default: "available",
    },

    // Documents
    insurance_end_date: { type: Date },
    puc_end_date: { type: Date },

    // Bike Lifecycle
    bike_end_date: { type: Date },

    // Maintenance
    last_service_date: { type: Date },
    bike_expenses: { type: Number, default: 0 },

    // Usage
    total_km_run: { type: Number, default: 0 },

    // Parts Replacement
    last_battery_changed: { type: Date },
    last_tyre_change: { type: Date },

    // GPS
    gps_installed_date: { type: Date },

    // Other
    image_url: String,

    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
    extra_images: [{ type: String }], // Array for 5 extra photos images: [{ type: String }], // Ek array jisme saare image paths store honge
  },
  { timestamps: true },
);

module.exports = mongoose.model("Bike", bikeSchema);