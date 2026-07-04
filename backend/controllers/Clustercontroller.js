const Cluster = require("../models/Cluster");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// CREATE cluster
exports.createCluster = async (req, res) => {
  try {
    if (req.user && req.user.role === "staff") {
      const hasArea = req.user.assigned_areas.some(
        (area) => area._id.toString() === req.body.area_id?.toString(),
      );
      if (!hasArea) {
        return res
          .status(403)
          .json({
            message: "Access denied: You are not assigned to this area",
          });
      }
    }

    const cluster = await Cluster.create(req.body);
    res.status(201).json(cluster);
  } catch (error) {
    console.error("Create Cluster Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL clusters
exports.getClusters = async (req, res) => {
  try {
    const filter = {};
    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === "staff") {
          filter.area_id = { $in: user.assigned_areas };
        }
      } catch (err) {
        // ignore jwt errors
      }
    }

    const clusters = await Cluster.find(filter)
      .populate("bikes")
      .populate("area_id", "name city")
      .sort({ createdAt: -1 });
    res.json(clusters);
  } catch (error) {
    console.error("Get Clusters Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE cluster by ID
exports.getClusterById = async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id)
      .populate("bikes")
      .populate("area_id", "name city");
    if (!cluster) {
      return res.status(404).json({ message: "Cluster not found" });
    }

    if (req.headers.authorization?.startsWith("Bearer")) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (user && user.role === "staff") {
          const hasArea = user.assigned_areas.some(
            (areaId) => areaId.toString() === cluster.area_id?.toString(),
          );
          if (!hasArea) {
            return res
              .status(403)
              .json({
                message:
                  "Access denied: You do not have access to this cluster's area",
              });
          }
        }
      } catch (err) {
        // ignore jwt errors
      }
    }

    res.json(cluster);
  } catch (error) {
    console.error("Get Cluster Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// UPDATE cluster
exports.updateCluster = async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ message: "Cluster not found" });
    }

    if (req.user && req.user.role === "staff") {
      const hasOldArea = req.user.assigned_areas.some(
        (area) => area._id.toString() === cluster.area_id?.toString(),
      );
      if (!hasOldArea) {
        return res
          .status(403)
          .json({
            message:
              "Access denied: You are not assigned to the cluster's current area",
          });
      }

      if (req.body.area_id) {
        const hasNewArea = req.user.assigned_areas.some(
          (area) => area._id.toString() === req.body.area_id.toString(),
        );
        if (!hasNewArea) {
          return res
            .status(403)
            .json({
              message:
                "Access denied: You cannot move the cluster to an unassigned area",
            });
        }
      }
    }

    const updatedCluster = await Cluster.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true },
    );

    res.json(updatedCluster);
  } catch (error) {
    console.error("Update Cluster Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE cluster
exports.deleteCluster = async (req, res) => {
  try {
    const cluster = await Cluster.findById(req.params.id);
    if (!cluster) {
      return res.status(404).json({ message: "Cluster not found" });
    }

    if (req.user && req.user.role === "staff") {
      const hasArea = req.user.assigned_areas.some(
        (area) => area._id.toString() === cluster.area_id?.toString(),
      );
      if (!hasArea) {
        return res
          .status(403)
          .json({
            message:
              "Access denied: You are not assigned to the cluster's area",
          });
      }
    }

    await cluster.deleteOne();
    res.json({ message: "Cluster deleted successfully" });
  } catch (error) {
    console.error("Delete Cluster Error:", error);
    res.status(500).json({ message: error.message });
  }
};
