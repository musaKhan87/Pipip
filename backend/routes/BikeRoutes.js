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
// BikeRouter.post("/", upload.single("image_url"), createBike);
// image_url: main photo (1)
// extra_images: additional photos (upto 5)
BikeRouter.post("/", upload.fields([
  { name: 'image_url', maxCount: 1 },
  { name: 'extra_images', maxCount: 5 }
]), createBike);
// BikeRouter.put("/:id", upload.single("image_url"), updateBike);
BikeRouter.put(
  "/:id",
  upload.fields([
    { name: "image_url", maxCount: 1 },
    { name: "extra_images", maxCount: 5 },
  ]),
  updateBike,
);
BikeRouter.delete("/:id", deleteBike);

module.exports = BikeRouter;
