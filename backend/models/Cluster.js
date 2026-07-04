const mongoose = require("mongoose");

const clusterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    bikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bike",
      },
    ],
    price_per_hour: { type: Number, required: true },
    price_per_day: { type: Number, required: true },
    area_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Area",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cluster", clusterSchema);
