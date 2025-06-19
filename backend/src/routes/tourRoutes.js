const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");

router.get("/", tourController.getAllTours);
router.post("/", tourController.createTour);
router.put("/:id", tourController.editTour);
router.delete("/:id", tourController.deleteTour);
router.post("/:id/clone", tourController.cloneTour);
router.get("/user/:userId", tourController.getUserTours);
router.get("/:id", tourController.getById);

module.exports = router;
