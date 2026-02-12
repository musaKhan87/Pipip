const Bike = require("../models/Bike");

/**
 * ADMIN: Create Bike
 */
const createBike = async (req, res) => {
  try {
    const image_url = req.file ? req.file.path : null;
    
    const bike = await Bike.create({
      ...req.body,
      image_url,
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
const updateBike = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.image_url = req.file.path;
    }

    const bike = await Bike.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    res.status(200).json(bike);
  } catch (error) {
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
