// models/Customer.js
const mongoose = require("mongoose");


const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: null },
    address: String,
    id_proof_type: String,
    id_proof_number: String,
    aadhaar_image_url: { type: String, required: true },
    license_image_url: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Customer", customerSchema);

// module.exports = mongoose.model("Customer", customerSchema);
