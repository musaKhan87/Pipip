const mongoose = require("mongoose");
const areaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);


module.exports = mongoose.model("Area", areaSchema);
