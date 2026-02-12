const Area = require("../models/Area");

// PUBLIC
const getActiveAreas = async (req, res) => {
  try {
    const areas = await Area.find({ is_active: true });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch areas" });
  }
};

const getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch areas" });
  }
};


// ADMIN
const createArea = async (req, res) => {
  try {
    const area = await Area.create(req.body);
    res.status(201).json(area);
  } catch (error) {
    res.status(400).json({ message: "Area creation failed" });
  }
};

const updateArea = async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(area);
  } catch (error) {
    res.status(400).json({ message: "Area update failed" });
  }
};

const deleteArea = async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.json({ message: "Area deleted" });
  } catch (error) {
    res.status(400).json({ message: "Area delete failed" });
  }
};

module.exports = {
  getActiveAreas,
  createArea,
  updateArea,
  deleteArea,
  getAreas
};
