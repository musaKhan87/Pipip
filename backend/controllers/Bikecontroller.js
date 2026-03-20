const Bike = require("../models/Bike");

/**
 * ADMIN: Create Bike
 */
// const createBike = async (req, res) => {
//   try {
//     const image_url = req.file ? req.file.path : null;
    
//     const bike = await Bike.create({
//       ...req.body,
//       image_url,
//     });

//     res.status(201).json(bike);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createBike = async (req, res) => {
  try {
    // Main image handle karein
    const image_url = req.files?.image_url ? req.files.image_url[0].path : null;

    // Extra images handle karein
    let extraImagePaths = [];
    if (req.files?.extra_images) {
      extraImagePaths = req.files.extra_images.map((file) => file.path);
    }

    const bike = await Bike.create({
      ...req.body,
      image_url,
      extra_images: extraImagePaths,
    });

    res.status(201).json(bike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    res.json(bike);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
/**
 * PUBLIC: Get All Bikes
 */
const getBikes = async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.status(200).json(bikes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADMIN: Update Bike
 */
// const updateBike = async (req, res) => {
//   try {
//     const updateData = { ...req.body };

//     if (req.file) {
//       updateData.image_url = req.file.path;
//     }

//     const bike = await Bike.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     res.status(200).json(bike);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// controllers/Bikecontroller.js
const updateBike = async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: "Not found" });

    const updateData = { ...req.body };

    // 1. Handle Main Profile Image
    if (req.files?.image_url) {
      updateData.image_url = req.files.image_url[0].path;
    }

    // 2. Handle Extra Images (Syncing Deletions + New Uploads)
    let finalExtraImages = [];

    // Check if frontend sent the list of images to KEEP
    if (req.body.remaining_extra_images) {
      try {
        // Parse the stringified array sent from FormData
        finalExtraImages = JSON.parse(req.body.remaining_extra_images);
      } catch (e) {
        finalExtraImages = [];
      }
    } else {
      // If no 'remaining' field is sent, assume we keep existing ones
      // (Safety fallback, though frontend should always send this now)
      finalExtraImages = bike.extra_images || [];
    }

    // Append NEWLY uploaded files to the kept ones
    if (req.files?.extra_images) {
      const newPaths = req.files.extra_images.map((f) => f.path);
      finalExtraImages = [...finalExtraImages, ...newPaths];
    }

    // Enforce the 5-image limit and update the data object
    updateData.extra_images = finalExtraImages.slice(0, 5);

    const updatedBike = await Bike.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // Use $set to ensure array replacement
      { new: true },
    );

    res.status(200).json(updatedBike);
  } catch (error) {
    console.error("Backend Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};
/**
 * ADMIN: Delete Bike
 */
const deleteBike = async (req, res) => {
  try {
    await Bike.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bike deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBike,
  getBikes,
  updateBike,
  deleteBike,
  getSingleBike,
};
