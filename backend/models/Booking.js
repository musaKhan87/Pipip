// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     customer_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Customer",
//       required: true,
//     },

//     bike_id: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Bike",
//       required: true,
//     },

//     // Customer Info
//     customer_name: { type: String, required: true },
//     contact_number: { type: String, required: true },
//     customer_email: String,
//     customer_location: String,

//     // Lead Source
//     lead_source: {
//       type: String,
//       enum: ["hotel", "social_media", "personal_reference", "other"],
    
//     },

//     source_name: {
//       type: String,
//       required: true,
//     },

//     // Vehicle
//     vehicle_make_model: {
//       type: String,
//       required: true,
//     },

//     // Rental Type
//     rental_type: {
//       type: String,
//       enum: ["hourly", "daily", "weekly", "monthly"],
//       required: true,
//     },

//     start_datetime: { type: Date, required: true },
//     end_datetime: { type: Date, required: true },

//     total_amount: { type: Number, required: true },

//     // Deposit
//     deposit_amount: { type: Number, required: true },

//     // Partner Shares
//     reference_partner_share: Number,
//     reference_partner_share_given: { type: Boolean, default: false },

//     provider_partner_share: Number,
//     provider_partner_share_given: { type: Boolean, default: false },

//     // Fuel
//     fuel_quantity: Number,

//     // Account Manager
//     account_manager: {
//       type: String,
//       required: true,
//     },

//     // Documents
//     customer_license_files: [String],
//     customer_id_proof_files: [String],

//     // Remarks
//     remarks: String,

//     // PAYMENT (Your existing fields)
//     payment_method: {
//       type: String,
//       enum: ["online", "cash"],
//       required: true,
//       default: "online",
//     },

//     payment_status: {
//       type: String,
//       enum: ["pending", "paid", "failed"],
//       default: "pending",
//     },

//     payment_order_id: {
//       type: String,
//     },

//     fuel_out_liters: Number,
//     fuel_in_liters: Number,

//     // Completion Charges
//     penalty_amount: { type: Number, default: 0 },
//     challan_amount: { type: Number, default: 0 },
//     damage_cost: { type: Number, default: 0 },

//     // Booking Status
//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "active", "completed", "cancelled"],
//       default: "pending",
//     },

//     notes: String,

//     updated_by_admin: {
//       type: Boolean,
//       default: false,
//     },
//     booking_source: {
//       type: String,
//       enum: ["online", "admin", "partner"],
//       default: "admin",
//     },
//   },
//   { timestamps: true },
// );

// module.exports = mongoose.model("Booking", bookingSchema);

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

    // Customer Info (❌ removed required)
    customer_name: { type: String },
    contact_number: { type: String },
    customer_email: String,
    customer_location: String,

    // Lead Source (❌ removed required)
    lead_source: {
      type: String,
      enum: ["hotel", "social_media", "personal_reference", "other"],
      default: "other",
    },

    source_name: {
      type: String,
      default: "direct",
    },

    // Vehicle (❌ removed required)
    vehicle_make_model: {
      type: String,
    },

    // Rental Type (❌ removed required)
    rental_type: {
      type: String,
      enum: ["hourly", "daily", "weekly", "monthly"],
      default: "daily",
    },

    start_datetime: { type: Date, required: true },
    end_datetime: { type: Date, required: true },

    total_amount: { type: Number, required: true },

    // Deposit (❌ removed required)
    deposit_amount: { type: Number, default: 0 },

    // Partner Shares
    reference_partner_share: { type: Number, default: 0 },
    reference_partner_share_given: { type: Boolean, default: false },

    provider_partner_share: { type: Number, default: 0 },
    provider_partner_share_given: { type: Boolean, default: false },

    // Fuel
    fuel_quantity: { type: Number, default: 0 },

    // Account Manager (❌ removed required)
    account_manager: {
      type: String,
      default: "system",
    },

    // Documents
    customer_license_files: [String],
    customer_id_proof_files: [String],

    // Remarks
    remarks: String,

    // PAYMENT
    payment_method: {
      type: String,
      enum: ["online", "cash"],
      default: "online",
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    payment_order_id: String,

    // Ride Tracking
    fuel_out_liters: Number,
    fuel_in_liters: Number,

    // Completion Charges
    penalty_amount: { type: Number, default: 0 },
    challan_amount: { type: Number, default: 0 },
    damage_cost: { type: Number, default: 0 },

    // Booking Source
    booking_source: {
      type: String,
      enum: ["online", "admin", "partner"],
      default: "admin",
    },

    // Status
    status: {
      type: String,
      enum: ["pending", "confirmed", "active", "completed", "cancelled"],
      default: "pending",
    },

    notes: String,

    updated_by_admin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Booking", bookingSchema);