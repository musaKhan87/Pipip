const express = require("express");
const ClusterRouter = express.Router();
const {
  getClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  getClusterById,
} = require("../controllers/Clustercontroller");
const { protect } = require("../middelwares/auth");

// Public
ClusterRouter.get("/", getClusters);
ClusterRouter.get("/:id", getClusterById);

// Protected Admin/Staff
ClusterRouter.post("/", protect, createCluster);
ClusterRouter.put("/:id", protect, updateCluster);
ClusterRouter.delete("/:id", protect, deleteCluster);

module.exports = ClusterRouter;
