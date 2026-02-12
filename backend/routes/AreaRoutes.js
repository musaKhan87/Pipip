const express = require("express");
const {
  getActiveAreas,
  createArea,
  updateArea,
  deleteArea,
  getAreas,
} = require("../controllers/Areacontroller");

const AreaRouter = express.Router();

AreaRouter.get("/areas", getAreas);
AreaRouter.get("/", getActiveAreas);
AreaRouter.post("/", createArea);
AreaRouter.put("/:id", updateArea);
AreaRouter.delete("/:id", deleteArea);

module.exports = AreaRouter;