const express = require("express");
const BikeRouter = express.Router();
const {
  getBikes,
  createBike,
  updateBike,
  deleteBike,
  getSingleBike,
} = require("../controllers/Bikecontroller");
const upload = require("../middelwares/upload");

// Public
BikeRouter.get("/", getBikes);
BikeRouter.get("/:id",getSingleBike);
// Admin
BikeRouter.post("/", upload.single("image_url"), createBike);
BikeRouter.put("/:id", upload.single("image_url"), updateBike);
BikeRouter.delete("/:id", deleteBike);

module.exports = BikeRouter;
